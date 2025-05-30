"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Formulario() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    receita: "",
    despesas: "",
    dividas: "",
    crescimento: "",
    ebitda: "",
    margemEbitda: "",
    receitaRecorrente: "",
    margemBruta: "",
    receitaBruta: "",
    giroAtivo: "",
    valuation: "",
    riscos: "",
    insights: "",
    ineficiencias: "", // novo campo
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      receita: form.receita,
      despesas: form.despesas,
      dividas: form.dividas,
      crescimento: form.crescimento,
      ebitda: form.ebitda,
      margemEbitda: form.margemEbitda,
      receitaRecorrente: form.receitaRecorrente,
      margemBruta: form.margemBruta,
      receitaBruta: form.receitaBruta,
      giroAtivo: form.giroAtivo,
      valuation: form.valuation,
      riscos: form.riscos,
      insights: form.insights,
      ineficiencias: form.ineficiencias, // incluir no payload
    };

    try {
      const res = await fetch("/api/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Resposta da API:", data);

      if (res.ok && data.id) {
        router.push(`/resultado/${data.id}`);
      } else {
        alert("Erro ao cadastrar empresa.");
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Formulário de Avaliação</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        {[
          ["nome", "Nome da Empresa", "text"],
          ["receita", "Receita", "number"],
          ["despesas", "Despesas", "number"],
          ["dividas", "Dívidas", "number"],
          ["crescimento", "Crescimento (%)", "number"],
          ["ebitda", "EBITDA", "number"],
          ["margemEbitda", "Margem EBITDA (%)", "number"],
          ["receitaRecorrente", "Receita Recorrente", "number"],
          ["margemBruta", "Margem Bruta (%)", "number"],
          ["receitaBruta", "Receita Bruta", "number"],
          ["giroAtivo", "Giro do Ativo", "number"],
          ["valuation", "Valuation", "number"],
          ["riscos", "Riscos", "text"],
          ["insights", "Insights Qualitativos", "text"],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label className="block mb-1 font-semibold">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={name !== "riscos" && name !== "insights"}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
        ))}

        {/* CAMPO DE INEFICIÊNCIAS */}
        <div>
          <label className="block mb-1 font-semibold">Ineficiências encontradas</label>
          <textarea
            name="ineficiencias"
            value={form.ineficiencias}
            onChange={handleChange}
            placeholder="Ex: processos manuais, alta rotatividade, baixa retenção de clientes..."
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
        >
          Enviar e Ver Resultado
        </button>
      </form>
    </div>
  );
}