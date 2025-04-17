import { NextResponse } from "next/server";

export async function POST(req) {
  const dados = await req.json();

  const res = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        Nome: dados.nome,
        Receita: Number(dados.receita),
        Despesas: Number(dados.despesas),
        Dividas: Number(dados.dividas),
        Crescimento: Number(dados.crescimento),
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}