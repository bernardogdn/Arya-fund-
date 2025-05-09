"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [empresas, setEmpresas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const res = await fetch(
          "https://api.airtable.com/v0/appoSPvXiuqHQ93Df/tblptHvfkGrPZESRH",
          {
            headers: {
              Authorization:
                "Bearer patelJIUhYK2tqQ9Z.c69eeff568c03a051fdcce0e343811a49c3e56c93c959075fce17e7001223cb5",
            },
          }
        );
        const data = await res.json();
        setEmpresas(data.records || []);
      } catch (err) {
        console.error("Erro ao buscar empresas:", err);
      }
    }

    fetchEmpresas();
  }, []);

  const topEmpresas = [...empresas]
    .filter((e) => typeof e.fields?.["Nota Geral"] === "number")
    .sort((a, b) => b.fields["Nota Geral"] - a.fields["Nota Geral"])
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Arya Fund</h1>
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>

        {/* RANQUEAMENTO DE EMPRESAS */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4">
            🏆 Ranqueamento de Empresas
          </h2>
          {topEmpresas.length === 0 ? (
            <p className="text-gray-400">Nenhuma empresa ranqueada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {topEmpresas.map((empresa, index) => (
                <li
                  key={empresa.id}
                  className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                >
                  <span className="font-bold">
                    {index === 0 && "🥇 "}
                    {index === 1 && "🥈 "}
                    {index === 2 && "🥉 "}
                    {empresa.fields?.Nome || "Sem nome"}
                  </span>
                  <span className="text-sm text-cyan-400 font-mono">
                    {empresa.fields["Nota Geral"]} / 100
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => router.push("/formulario")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Começar análise
          </button>
        </div>

        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Empresas já avaliadas
        </h2>

        {empresas.length === 0 ? (
          <p className="text-gray-400">Nenhuma empresa cadastrada ainda.</p>
        ) : (
          <ul className="space-y-4">
            {empresas.map((empresa, index) => {
              const nome = empresa.fields?.Nome || "Sem nome";
              const nota = empresa.fields?.["Nota Geral"] ?? "N/A";
              const id = empresa.id;

              return (
                <li
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-xl font-semibold">{nome}</p>
                    <p className="text-sm text-gray-300">
                      Nota Geral: {nota} / 100
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/resultado/${id}`)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                    >
                      Ver análise
                    </button>
                    <button
                      onClick={() => router.push(`/diligencia/${id}`)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                      Criar Due Diligence
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}