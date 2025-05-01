
⸻

🧠 Arya Fund

Arya Fund é uma plataforma inteligente que utiliza Inteligência Artificial para analisar empresas com base em dados preenchidos por usuários. A ferramenta foi pensada para facilitar o processo de tomada de decisão de investimento, oferecendo insights automatizados e integrando com o Airtable para armazenamento dos dados.

⚙️ Funcionalidades
	•	📋 Formulário de Avaliação de Empresas
Coleta dados estratégicos e financeiros sobre uma empresa para análise.
	•	🤖 Análise Inteligente via IA
Avalia a atratividade da empresa com base em critérios objetivos e qualitativos.
	•	🗃️ Integração com Airtable
Armazena e organiza automaticamente os dados coletados.
	•	💻 Deploy com Vercel
Plataforma hospedada de forma gratuita e escalável.

🛠️ Tecnologias Utilizadas
	•	Next.js
	•	React
	•	Vercel
	•	Airtable API
	•	OpenAI API (futuramente, para análise via IA)

📁 Estrutura do Projeto

arya-fund/
├── pages/
│   ├── index.tsx          → Formulário de envio
│   ├── status.tsx         → Acompanhamento de status
│   └── api/
│       └── submit.ts      → Rota que envia dados para o Airtable
├── utils/
│   └── airtable.ts        → Função de integração com a API do Airtable
├── styles/
│   └── globals.css
├── .env.local             → Variáveis de ambiente
└── README.md

🔐 Configuração de Ambiente

Crie um arquivo .env.local com as seguintes variáveis:

AIRTABLE_API_KEY=seu_token_aqui
AIRTABLE_BASE_ID=seu_id_de_base
AIRTABLE_TABLE_NAME=EDERE

Importante: nunca versionar esse arquivo nem expor os dados sensíveis.

🚀 Como rodar localmente

git clone https://github.com/seu-usuario/arya-fund.git
cd arya-fund
npm install
npm run dev

Acesse: http://localhost:3000

✅ Status do Projeto
	•	Integração com Airtable
	•	Envio de dados via formulário
	•	Página de acompanhamento
	•	Implementação da IA para análise
	•	Dashboard para investidores

📦 Deploy

O projeto está hospedado em:
🔗https://arya-fund-gim5ou78v-bernardo-ardenghi-s-projects.vercel.app

🧠 Sobre o Arya Fund

A Arya Fund nasce da ideia de democratizar o acesso à análise de investimentos com uma abordagem automatizada, segura e educativa. O objetivo é auxiliar empreendedores e investidores a tomarem decisões baseadas em dados, com o suporte da tecnologia.
