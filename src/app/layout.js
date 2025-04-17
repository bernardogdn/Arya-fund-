import "./globals.css";

export const metadata = {
  title: "Arya Fund",
  description: "Plataforma de avaliação de empresas com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
