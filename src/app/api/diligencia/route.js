import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const fields = {
    "ID": [body.empresaId], // campo linkado no Airtable com a tabela Empresas
    "Tipo de Diligência": body.tipo,
    "Item Analisado": body.item,
    "Status da Análise": body.status,
    "Comentários": body.comentarios,
    "Documento": body.documento,
    "Classificação de Risco": body.risco,
  };

  try {
    const res = await fetch("https://api.airtable.com/v0/appoSPvXiuqHQ93Df/tblpipmgtV3dit7iq", {
      method: "POST",
      headers: {
        Authorization: `Bearer patelJIUhYK2tqQ9Z.c69eeff568c03a051fdcce0e343811a49c3e56c93c959075fce17e7001223cb5`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

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