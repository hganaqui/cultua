# 🎵 CULTUA

**Celebre sua fé sem distrações**

Plataforma cristã de conteúdo 100% sem anúncios. Pregações, louvores, devocionais e comunidade em um único lugar.

## 🎯 Visão

Criar um espaço seguro, curado e livre de distrações para que cristãos possam consumir conteúdo edificante em paz.

## ✨ Características

- ✅ 100% SEM ANÚNCIOS (nunca!)
- ✅ Conteúdo curado por moderadores
- ✅ Seguro para famílias
- ✅ Comunidade engajada
- ✅ Player robusto sem publicidade
- ✅ Playlists personalizadas
- ✅ Compartilhamento fácil

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: Cloudflare R2 (vídeos/áudios)
- **Deploy**: Vercel
- **Mobile**: React Native + Expo (em desenvolvimento)

## 📅 Roadmap

- **Q1 (10 semanas)**: MVP - Auth + Browse + Player sem anúncios
- **Q2 (6 semanas)**: Upload + Curadoria + Comunidade
- **Q3 (4 semanas)**: Salas de Igreja (B2B)
- **Q4 (8 semanas)**: IA + Mobile Apps

## 🚀 Como Começar

### Instalação

```bash
git clone https://github.com/seu-usuario/cultua.git
cd cultua
npm install

Desenvolvimento
npm run dev
Acesse: http://localhost:3000

Build para Produção
npm run build
npm start

🔧 Variáveis de Ambiente
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-aqui
CLOUDFLARE_R2_ACCOUNT_ID=seu-id
CLOUDFLARE_R2_ACCESS_KEY=sua-chave
CLOUDFLARE_R2_SECRET=seu-secret
CLOUDFLARE_R2_BUCKET_NAME=cultua-media

📁 Estrutura de Pastas
cultua/
├── src/
│   ├── app/              # Rotas e páginas
│   ├── components/       # Componentes React
│   ├── lib/              # Utilitários e configurações
│   ├── hooks/            # Custom hooks
│   ├── types/            # Tipos TypeScript
│   └── styles/           # Estilos CSS
├── public/               # Assets estáticos
└── .env.local            # Variáveis de ambiente

🤝 Como Contribuir
Fork o repositório
Crie uma branch: git checkout -b feature/sua-feature
Commit: git commit -am 'Add nova feature'
Push: git push origin feature/sua-feature
Abra Pull Request
📝 Código de Conduta
Seja respeitoso. Este é um projeto cristão dedicado a servir a comunidade de fé.

📞 Suporte
Email: suporte@cultua.app
Instagram: @cultua
📄 Licença
MIT License