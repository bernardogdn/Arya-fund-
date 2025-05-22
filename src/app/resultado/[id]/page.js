"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResultadoPorId() {
  const { id } = useParams();
  const router = useRouter();
  const [dados, setDados] = useState(null);
  const [diligencias, setDiligencias] = useState([]);
  const [analiseIA, setAnaliseIA] = useState("");

  function calcularNotaGeral(dados) {
    let nota = 0;
    const receita = Number(dados.Receita || 0);
    const despesas = Number(dados.Despesas || 0);
    const dividas = Number(dados.Dívidas || 0);
    const lucro = receita - despesas;
    const margemLucro = receita !== 0 ? (lucro / receita) * 100 : 0;
    const endividamento = receita !== 0 ? (dividas / receita) * 100 : 0;

    if (Number(dados.Crescimento) >= 10) nota += 10;
    if (Number(dados["Margem EBITDA"]) >= 15) nota += 15;
    if (receita !== 0 && Number(dados["Receita Recorrente"]) / receita >= 0.6) nota += 15;
    if (endividamento <= 50) nota += 10;
    if (Number(dados["Margem Bruta"]) >= 40) nota += 10;
    if (lucro > 0) nota += 10;
    if (Number(dados["Giro do Ativo"]) >= 1) nota += 10;
    if (dados["Insights Qualitativos"]?.trim()) nota += 10;
    if (dados.Riscos?.trim()) nota += 10;

    return nota;
  }

  function gerarInsight() {
    const margemEBITDA = Number(dados["Margem EBITDA"]);
    const endividamento = Number(((Number(dados.Dívidas || 0) / Number(dados.Receita || 1)) * 100).toFixed(1));
    const crescimento = Number(dados.Crescimento);

    if (margemEBITDA >= 25 && endividamento <= 30 && crescimento >= 15) {
      return "Insight: Empresa com excelente desempenho financeiro e baixo risco. Ótima candidata à aquisição.";
    }

    if (margemEBITDA >= 15 && endividamento <= 50 && crescimento >= 10) {
      return "Insight: Empresa saudável com indicadores consistentes. Boa oportunidade com margem de segurança.";
    }

    if (margemEBITDA < 10 || endividamento > 70) {
      return "Insight: Empresa com sinais de risco financeiro. Análise mais aprofundada recomendada.";
    }

    return "Insight: Empresa razoável, com indicadores mistos. Potencial com ajustes operacionais.";
  }

  function avaliarComIA() {
    const nota = calcularNotaGeral(dados);
    const insight = gerarInsight();
    let risco = "Média";

    if (nota >= 80) risco = "Baixa";
    else if (nota < 50) risco = "Alta";

    setAnaliseIA(`🤖 Avaliação Inteligente\nNota: ${nota}/100\nRisco: ${risco}\n${insight}`);
  }

  function exportarTXT() {
    const endividamento = ((Number(dados.Dívidas || 0) / Number(dados.Receita || 1)) * 100).toFixed(1);
    const prompt = `Empresa: ${dados.Nome}
Nota Geral: ${dados.notaGeral}/100
Valuation: R$ ${dados.Valuation}
Receita: R$ ${dados.Receita}
Despesas: R$ ${dados.Despesas}
Dívidas: R$ ${dados.Dívidas}
Margem EBITDA: ${dados["Margem EBITDA"]}%
Receita Recorrente: R$ ${dados["Receita Recorrente"]}
Classificação Final: ${dados["Avaliação Final"]}

Due Diligences:
${diligencias.map((d) => `- ${d.fields["Tipo de Diligência"]} (${d.fields["Item Analisado"]}, ${d.fields["Status da Análise"]}, risco: ${d.fields["Classificação de Risco"]})`).join("\n")}

Com base nessas informações, gere uma análise executiva destacando oportunidades, riscos e atratividade para investidores.`;

    const texto = `Empresa: ${dados.Nome}
Valuation: R$ ${dados.Valuation}
Nota Geral: ${dados.notaGeral}/100
Crescimento: ${dados.Crescimento}%
Margem EBITDA: ${dados["Margem EBITDA"]}%
Endividamento: ${endividamento}%
${gerarInsight()}

Prompt para IA:
${prompt}`;

    const blob = new Blob([texto], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dados.Nome}_analise.txt`;
    link.click();
  }

  function exportarCSV() {
    const endividamento = ((Number(dados.Dívidas || 0) / Number(dados.Receita || 1)) * 100).toFixed(1);
    const prompt = `Empresa: ${dados.Nome}
Nota Geral: ${dados.notaGeral}/100
Valuation: R$ ${dados.Valuation}
Receita: R$ ${dados.Receita}
Despesas: R$ ${dados.Despesas}
Dívidas: R$ ${dados.Dívidas}
Margem EBITDA: ${dados["Margem EBITDA"]}%
Receita Recorrente: R$ ${dados["Receita Recorrente"]}
Classificação Final: ${dados["Avaliação Final"]}

Due Diligences:
${diligencias.map((d) => `- ${d.fields["Tipo de Diligência"]} (${d.fields["Item Analisado"]}, ${d.fields["Status da Análise"]}, risco: ${d.fields["Classificação de Risco"]})`).join("\n")}

Com base nessas informações, gere uma análise executiva destacando oportunidades, riscos e atratividade para investidores.`;

    const csv = `Campo,Valor
Empresa,${dados.Nome}
Valuation,R$ ${dados.Valuation}
Nota Geral,${dados.notaGeral}/100
Crescimento,${dados.Crescimento}%
Margem EBITDA,${dados["Margem EBITDA"]}%
Endividamento,${endividamento}%
Insight,${gerarInsight()}
Prompt para IA,"${prompt.replace(/\n/g, ' ')}"`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dados.Nome}_analise.csv`;
    link.click();
  }

  useEffect(() => {
    async function buscarEmpresa() {
      try {
        const res = await fetch(`/api/empresas/${id}`);
        const dados = await res.json();
        dados.notaGeral = calcularNotaGeral(dados);
        setDados(dados);
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      }
    }

    async function buscarDiligencias() {
      try {
        const res = await fetch(`/api/diligencias?id=${id}`);
        const data = await res.json();
        setDiligencias(data.records || []);
      } catch (error) {
        console.error("Erro ao buscar diligências:", error);
      }
    }

    if (id) {
      buscarEmpresa();
      buscarDiligencias();
    }
  }, [id]);

  if (!dados) {
    return <p className="text-white text-center mt-10">Carregando análise...</p>;
  }

  const receita = Number(dados.Receita || 0);
  const despesas = Number(dados.Despesas || 0);
  const dividas = Number(dados.Dívidas || 0);
  const lucro = receita - despesas;
  const margemLucro = receita !== 0 ? ((lucro / receita) * 100).toFixed(1) : 0;
  const endividamento = receita !== 0 ? ((dividas / receita) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">🧠 Relatório Inteligente</h2>
        <p className="text-gray-300 text-sm mb-1">
          A empresa <strong>{dados.Nome}</strong> apresenta uma margem EBITDA de
          <strong> {dados["Margem EBITDA"]}%</strong> e uma margem bruta de
          <strong> {dados["Margem Bruta"]}%</strong>, com um crescimento de
          <strong> {dados.Crescimento}%</strong>. Sua receita recorrente atinge
          <strong> {dados["Receita Recorrente"]}</strong> e o endividamento está em
          <strong> {endividamento}%</strong>. A avaliação geral é
          <strong> {dados["Avaliação Final"]}</strong>.
        </p>
        <p className="mt-2 text-green-400">{gerarInsight()}</p>

        {analiseIA && (
          <div className="bg-cyan-900 text-white p-4 mt-4 rounded">
            <pre className="whitespace-pre-wrap">{analiseIA}</pre>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={avaliarComIA}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded"
          >
            🔍 Reavaliar com IA
          </button>
          <button
            onClick={exportarTXT}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
          >
            Exportar TXT
          </button>
          <button
            onClick={exportarCSV}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded"
          >
            Exportar CSV
          </button>
        </div>

        {diligencias.length > 0 && (
          <>
            <p className="mt-4 text-yellow-300">
              📝 A empresa possui {diligencias.length} análises de due diligence:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {diligencias.map((d, i) => (
                <li key={i}>
                  <strong>{d.fields["Tipo de Diligência"]}</strong> - {d.fields["Item Analisado"]} (
                  {d.fields["Status da Análise"]}) - risco <strong>{d.fields["Classificação de Risco"]}</strong>.
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">{dados.Nome}</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-2">
        <p>Receita: R$ {receita}</p>
        <p>Despesas: R$ {despesas}</p>
        <p>Dívidas: R$ {dividas}</p>
        <p>Crescimento: {dados.Crescimento}%</p>
        <p>EBITDA: R$ {dados.EBITDA}</p>
        <p>Receita Recorrente: R$ {dados["Receita Recorrente"]}</p>
        <p>Margem EBITDA: {dados["Margem EBITDA"]}%</p>
        <p>Margem Bruta: {dados["Margem Bruta"]}%</p>
        <p>Receita Bruta: R$ {dados["Receita Bruta"]}</p>
        <p>Giro do Ativo: {dados["Giro do Ativo"]}</p>
        <p>Valuation: R$ {dados.Valuation}</p>

        <hr className="my-4 border-white/20" />

        <p>💰 Lucro: R$ {lucro}</p>
        <p>📈 Margem de Lucro: {margemLucro}%</p>
        <p>⚖️ Endividamento: {endividamento}%</p>
        <p className="text-lg font-semibold mt-2">
          ✅ Avaliação Final: {dados["Avaliação Final"]}
        </p>
        <p className="text-lg font-bold text-cyan-300">
          ⭐ Nota Geral: {dados.notaGeral}/100
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-center text-yellow-500 mb-4">
          📋 Due Diligence ({diligencias.length})
        </h2>
        {diligencias.length === 0 ? (
          <p className="text-center text-gray-400">Nenhuma diligência registrada para esta empresa.</p>
        ) : (
          diligencias.map((d, i) => {
            const f = d.fields || {};
            return (
              <div key={i} className="bg-gray-800 p-4 rounded-lg space-y-1">
                <p><strong>Tipo:</strong> {f["Tipo de Diligência"]}</p>
                <p><strong>Item:</strong> {f["Item Analisado"]}</p>
                <p><strong>Status:</strong> {f["Status da Análise"]}</p>
                <p><strong>Risco:</strong> {f["Classificação de Risco"]}</p>
                <p><strong>Comentários:</strong> {f["Comentários"]}</p>
                {f["Documento"] && (
                  <p>
                    <strong>Documento:</strong>{" "}
                    <a href={f["Documento"]} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                      Link
                    </a>
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}