import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    const res = await fetch(
      "https://api.airtable.com/v0/appoSPvXiuqHQ93Df/tblpipmgtV3dit7iq",
      {
        headers: {
          Authorization: `Bearer patelJIUhYK2tqQ9Z.c69eeff568c03a051fdcce0e343811a49c3e56c93c959075fce17e7001223cb5`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Erro ao buscar dados" }, { status: res.status });
    }

    // ✅ Filtra por relação no campo de link (ID é um array de record IDs)
    const relacionados = data.records.filter((registro) =>
      Array.isArray(registro.fields?.ID) && registro.fields.ID.includes(id)
    );

    return NextResponse.json({ records: relacionados });
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar diligências:", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}