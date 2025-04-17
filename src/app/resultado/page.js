"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { useRouter } from "next/navigation";

export default function Resultado() {
  const [dados, setDados] = useState(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [analise, setAnalise] = useState({});
  const router = useRouter();

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("dadosEmpresa");
    if (dadosSalvos) {
      const empresa = JSON.parse(dadosSalvos);
      setDados(empresa);

      const receita = Number(empresa.receita);
      const despesas = Number(empresa.despesas);
      const lucro = receita - despesas;
      const margem = (lucro / receita) * 100;
      const dividas = Number(empresa.dividas);
      const endividamento = dividas / receita;
      const crescimento = Number(empresa.crescimento);

      setAnalise({ lucro, margem, endividamento });

      if (lucro > 0 && margem > 15 && endividamento < 0.5 && crescimento > 10) {
        setDiagnostico("✅ Empresa com alto potencial para investimento.");
      } else if (lucro < 0 || margem < 10 || endividamento > 0.8) {
        setDiagnostico("❌ Empresa com alto risco. Não recomendada.");
      } else {
        setDiagnostico("🟡 Empresa razoável. Pode melhorar.");
      }
    }
  }, []);

  if (!dados) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Carregando dados...</p>
      </main>
    );
  }

  const dadosGrafico = [
    { nome: "Receita", valor: Number(dados.receita) },
    { nome: "Despesas", valor: Number(dados.despesas) },
    { nome: "Dívidas", valor: Number(dados.dividas) },
    { nome: "Lucro", valor: analise.lucro },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Resultado da Análise</h1>

      <div className="mb-4">
        <p>Receita: R$ {dados.receita}</p>
        <p>Despesas: R$ {dados.despesas}</p>
        <p>Dívidas: R$ {dados.dividas}</p>
        <p>Crescimento: {dados.crescimento}%</p>
      </div>

      <hr className="w-full border-white my-4" />

      <div className="mb-4">
        <p>💰 <strong>Lucro:</strong> R$ {analise.lucro}</p>
        <p>📈 <strong>Margem de Lucro:</strong> {analise.margem?.toFixed(1)}%</p>
        <p>⚖️ <strong>Endividamento:</strong> {(analise.endividamento * 100).toFixed(1)}%</p>
      </div>

      <hr className="w-full border-white my-4" />

      <p className="text-xl font-semibold mb-6">{diagnostico}</p>

      <h2 className="text-lg font-bold mb-4">📊 Gráfico de Desempenho da Empresa</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={dadosGrafico}
            layout="vertical"
            margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" stroke="#ffffff">
              <Label value="Valores (R$)" position="insideBottomRight" offset={-5} fill="#ffffff" />
            </XAxis>
            <YAxis dataKey="nome" type="category" stroke="#ffffff" />
            <Tooltip cursor={{ fill: "#2d2d2d" }} />
            <Legend />
            <Bar dataKey="valor" fill="#38bdf8" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={() => router.push("/formulario")}
        className="mt-8 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
      >
        Voltar ao formulário
      </button>
    </main>
  );
}