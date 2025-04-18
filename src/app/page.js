export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8">
      <img src="/logo.png" alt="Logo Arya Fund" className="w-24 h-24 mb-4" />
      <h1 className="text-4xl font-bold mb-4">Arya Fund</h1>
      <p className="text-xl mb-6 text-center">
        Use inteligência artificial para descobrir se sua empresa está pronta para receber investimentos.
      </p>
      <a
        href="/formulario"
        className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
      >
        Começar análise
      </a>
    </main>
  );
}