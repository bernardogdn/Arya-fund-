import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  // Cálculo da avaliação
  const receita = Number(body.receita);
  const despesas = Number(body.despesas);
  const dividas = Number(body.dividas);
  const lucro = receita - despesas;
  const margemLucro = receita !== 0 ? (lucro / receita) * 100 : 0;
  const endividamento = receita !== 0 ? (dividas / receita) * 100 : 0;

  let avaliacaoFinal = "Em avaliação";
  if (lucro > 0 && margemLucro >= 15 && endividamento < 50) {
    avaliacaoFinal = "Aprovado";
  } else if (lucro > 0 && margemLucro >= 5) {
    avaliacaoFinal = "Em avaliação";
  } else {
    avaliacaoFinal = "Não aprovado";
  }

  // Cálculo da nota geral
  let notaGeral = 0;
  if (Number(body.crescimento) >= 10) notaGeral += 10;
  if (Number(body.margemEbitda) >= 15) notaGeral += 15;
  if (receita !== 0 && Number(body.receitaRecorrente) / receita >= 0.6) notaGeral += 15;
  if (endividamento <= 50) notaGeral += 10;
  if (Number(body.margemBruta) >= 40) notaGeral += 10;
  if (lucro > 0) notaGeral += 10;
  if (Number(body.giroAtivo) >= 1) notaGeral += 10;
  if (body.insights?.trim()) notaGeral += 10;
  if (body.riscos?.trim()) notaGeral += 10;

  const fields = {
    "Nome": body.nome,
    "Receita": receita,
    "Despesas": despesas,
    "Dívidas": dividas,
    "Crescimento": Number(body.crescimento),
    "EBITDA": Number(body.ebitda),
    "Margem EBITDA": Number(body.margemEbitda),
    "Receita Recorrente": Number(body.receitaRecorrente),
    "Margem Bruta": Number(body.margemBruta),
    "Receita Bruta": Number(body.receitaBruta),
    "Giro do Ativo": Number(body.giroAtivo),
    "Valuation": Number(body.valuation),
    "Riscos": body.riscos,
    "Insights Qualitativos": body.insights,
    "Avaliação Final": [avaliacaoFinal], // MULTISELECT no Airtable
    "Nota Geral": notaGeral,
  };

  try {
    const res = await fetch(
      "https://api.airtable.com/v0/appoSPvXiuqHQ93Df/tblptHvfkGrPZESRH",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer patelJIUhYK2tqQ9Z.c69eeff568c03a051fdcce0e343811a49c3e56c93c959075fce17e7001223cb5`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("Erro no Airtable:", result);
      return NextResponse.json({ error: "Erro ao salvar no Airtable." }, { status: 500 });
    }

    return NextResponse.json({ message: "Sucesso!", id: result.id });
  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json({ error: "Erro ao conectar com o Airtable." }, { status: 500 });
  }
}