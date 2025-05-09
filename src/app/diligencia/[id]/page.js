"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function FormularioDueDiligenciaPorId() {
  const router = useRouter();
  const { id } = useParams(); // ID da empresa (record ID do Airtable)

  const [form, setForm] = useState({
    empresaId: "",
    tipo: "",
    item: "",
    status: "",
    comentarios: "",
    documento: "",
    risco: "",
  });

  useEffect(() => {
    if (id) {
      setForm((prev) => ({ ...prev, empresaId: id }));
    }
  }, [id]);

  const [opcoes, setOpcoes] = useState({
    tipos: [],
    status: [],
    riscos: [],
  });

  useEffect(() => {
    setOpcoes({
      tipos: ["Financeira", "Jurídica", "Contábil", "Operacional", "Ambiental"],
      status: ["Pendente", "Em andamento", "Concluída", "Com Risco"],
      riscos: ["Baixo", "Médio", "Alto"],
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // LOG para testar o ID sendo enviado
    console.log("Empresa ID que será enviada:", form.empresaId);

    try {
      const res = await fetch("/api/diligencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Resposta:", data);

      if (res.ok) {
        router.push(`/resultado/${id}`);
      } else {
        alert("Erro ao enviar due diligence");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Due Diligence</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        {/* Tipo */}
        <div>
          <label className="block mb-1 font-semibold">Tipo de Diligência</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Selecione...</option>
            {opcoes.tipos.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Item */}
        <div>
          <label className="block mb-1 font-semibold">Item Analisado</label>
          <input
            type="text"
            name="item"
            value={form.item}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-semibold">Status da Análise</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Selecione...</option>
            {opcoes.status.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Comentários */}
        <div>
          <label className="block mb-1 font-semibold">Comentários</label>
          <input
            type="text"
            name="comentarios"
            value={form.comentarios}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        {/* Documento */}
        <div>
          <label className="block mb-1 font-semibold">
            Link do Documento (URL)
          </label>
          <input
            type="url"
            name="documento"
            value={form.documento}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        {/* Risco */}
        <div>
          <label className="block mb-1 font-semibold">Classificação de Risco</label>
          <select
            name="risco"
            value={form.risco}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Selecione...</option>
            {opcoes.riscos.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
        >
          Enviar Due Diligence
        </button>
      </form>
    </div>
  );
}