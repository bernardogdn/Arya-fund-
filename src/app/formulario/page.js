"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Formulario() {
  const router = useRouter();
  const [dados, setDados] = useState({
    nome: "",
    receita: "",
    despesas: "",
    dividas: "",
    crescimento: "",
  });

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ENVIA OS DADOS PARA O AIRTABLE
      await axios.post("/api/enviar", dados);
      alert("Dados enviados com sucesso!");

      // SALVA LOCAL E REDIRECIONA
      localStorage.setItem("dadosEmpresa", JSON.stringify(dados));
      router.push("/resultado");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao enviar dados.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8">
      <img src="/logo.png" alt="Logo Arya Fund" className="w-32 h-auto mb-4" />
      <h1 className="text-3xl font-bold mb-6">ARYA FUND</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label className="block mb-1">Nome da Empresa:</label>
          <input
            type="text"
            name="nome"
            value={dados.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-white bg-white text-black"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Receita Mensal:</label>
          <input
            type="number"
            name="receita"
            value={dados.receita}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-white bg-white text-black"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Despesas Mensais:</label>
          <input
            type="number"
            name="despesas"
            value={dados.despesas}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-white bg-white text-black"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Dívidas Totais:</label>
          <input
            type="number"
            name="dividas"
            value={dados.dividas}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-white bg-white text-black"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Crescimento (%) ao ano:</label>
          <input
            type="number"
            name="crescimento"
            value={dados.crescimento}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-white bg-white text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}