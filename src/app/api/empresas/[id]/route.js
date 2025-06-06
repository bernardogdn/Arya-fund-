import { NextResponse } from "next/server";

export async function GET(_request, context) {
  const id  = context?.params?.id;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/appoSPvXiuqHQ93Df/tblptHvfkGrPZESRH/${id}`,
      {
        headers: {
          Authorization: `Bearer patelJIUhYK2tqQ9Z.c69eeff568c03a051fdcce0e343811a49c3e56c93c959075fce17e7001223cb5`,
        },
      }
    );

    if (!res.ok) {
      const erro = await res.text();
      console.error("Erro ao buscar empresa:", erro);
      return NextResponse.json(
        { error: "Erro ao buscar empresa" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data.fields);
  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 }
    );
  }
}