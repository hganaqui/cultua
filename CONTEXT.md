CULTUA — Contexto Completo para Novo Chat
📋 Overview
CULTUA é uma plataforma de conteúdo cristão com Sistema de Curadoria, Upload, Perfil e Gerenciamento de Usuários.

Stack:

Frontend: Next.js 16.3.4 + React + TypeScript
Backend: Supabase (PostgreSQL + Auth + Storage RLS)
UI: Inline CSS (sem Tailwind)
Storage: Cloudflare R2 + Supabase Storage
Deploy: Vercel
Theme: Dark mode (#111111 bg)
🔗 Links Importantes
Recurso	URL
Produção	https://plataforma-crista.vercel.app
Repositório	https://github.com/hganaqui/cultua
Supabase	https://app.supabase.com
Cloudflare	https://dash.cloudflare.com
🎨 Color Palette (OBRIGATÓRIO)
PÁGINA:      backgroundColor: '#111111'
CARD:        backgroundColor: '#1a1a1a'
INPUT:       backgroundColor: '#111111', border: '1px solid #333333'
HOVER/SEL:   backgroundColor: '#2a2a2a'
SKELETON:    backgroundColor: '#2a2a2a'

PRIMÁRIA:    '#B8860B' (dourado — botões, icons)
SECONDARY:   '#D4AF37' (dourado claro)
DANGER:      '#EF4444' (rejeição, logout)
SUCCESS:     '#22C55E' (aprovação)
INFO:        '#60A5FA'
SUPERADMIN:  '#A855F7' (roxo)

TEXTO:
  Título:    '#FFFFFF'
  Corpo:     '#CCCCCC'
  Muted:     '#555555' / '#666666'

BORDER:
  Card:      '#2a2a2a'
  Input:     '#333333'
  Select:    '#444444'
  Header:    '2px solid #B8860B'
✅ Features Implementadas
🔐 Auth
Login, Signup, Esqueci Senha, Nova Senha, Callback
Session management com Supabase SSR
Proxy.ts para proteção de rotas
🎯 Header & Navegação
100% client, reativo ao login
Avatar com <img> nativo + onError fallback emoji
Badge de role: ⭐ Admin / ⚡ Superadmin
Badge de notificações realtime
Dropdown fecha ao clicar fora
🏠 Home (/)
Dark theme: backgroundColor: '#111111' ✅
Hero: dark gradient
CategorySection: dark + cards #F5F3F0 (off-white suave)
👤 Configurações (/configuracoes) — ✅ FUNCIONAL
Foto de perfil: <img> nativo com cache bust
Avatar grande 100px com overlay câmera
Nome completo precarregado do banco
Alterar senha (mín. 6 chars)
Encerrar sessão
Zona de perigo: excluir conta (em breve)
🛡️ Painel de Curadoria (/admin) — ✅ COMPLETO
3 abas: Pendentes, Aprovados, Rejeitados
Sync automática: Query ao trocar de aba
Filtros: Categoria, Autor, Busca, Ordenação
Ações: Aprovar, Rejeitar, Destacar, Deletar
📤 Upload de Conteúdo (/admin/upload) — ✅ COMPLETO
Tipos: Vídeo, Áudio, Texto
Upload via presigned URLs (R2)
Progresso: Barra de progresso
Status: pending → fila de curadoria
👥 Gerenciar Usuários (/admin/usuarios) — ✅ SUPERADMIN ONLY
Gerencia roles: user/admin/superadmin
Define escopos: categorias + criadores
🎯 Sistema de Roles e Escopos
user       → acesso padrão
admin      → modera do seu escopo
superadmin → acesso total
📬 Sistema de Notificações
Tabela notifications criada com RLS
Badge realtime no Header
Triggers SQL automáticos
/notificacoes — a implementar
📐 Padrões Obrigatórios
Dark Theme Wrapper
tsx
Copy code
<div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
  <Header />
  <MeuClient ... />
  <Footer />
</div>
Avatar Nativo (OBRIGATÓRIO)
tsx
Copy code
// ✅ CORRETO — sem next/image
<img
  src={avatarUrl}
  alt="Avatar"
  onError={() => setImgError(true)}
  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
/>
Supabase Clients
typescript
Copy code
// Browser
import { supabase } from '@/lib/supabase'

// Server
const supabase = await createServerSupabase()

// Admin (NUNCA em client!)
import { supabaseAdmin } from '@/lib/supabase-admin'

📁 Project Structure
src/
├── app/
│   ├── admin/
│   │   ├── AdminClient.tsx          ✅ Painel de Curadoria (pending/approved/rejected)
│   │   └── page.tsx
│   ├── admin/upload/
│   │   ├── UploadClient.tsx         ✅ Upload de conteúdo
│   │   └── page.tsx
│   ├── configuracoes/
│   │   ├── ConfiguracoesClient.tsx  ✅ Perfil do usuário (avatar, nome, senha)
│   │   └── page.tsx
│   ├── perfil/
│   │   └── page.tsx                 🔍 Perfil público (visualização apenas)
│   ├── meus-uploads/
│   │   ├── MeusUploadsClient.tsx    ✅ Uploads do usuário
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx                      ✅ Home com CategorySection
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CategorySection.tsx           ✅ Categorias (Louvor, Pregação, etc)
│   ├── VideoCard.tsx                 ✅ Card de vídeo
│   └── ...
├── lib/
│   ├── supabase.ts                  Client Supabase
│   ├── supabase-server.ts           Server Supabase
│   ├── auth.ts                      Funções de auth
│   ├── r2.ts                        Upload limits config
│   ├── cultua-config.ts             Config colors & constants
│   └── ...
├── types/
│   └── index.ts                     Type definitions
└── api/
    ├── upload-avatar/route.ts        ✅ Upload avatar (Configurações)
    ├── upload/presigned/route.ts     ✅ Presigned URLs (UploadClient)
    ├── init-profile/route.ts         ✅ Init profile com nome do email
    └── ...
🔑 Key Features Implemented
✅ 1. Painel de Curadoria (/admin)
3 abas: Pendentes, Aprovados, Rejeitados
Carregamento: Todos 3 status em paralelo ao abrir
Filtros: Por categoria, autor, busca, ordenação
Ações: Aprovar, Rejeitar, Destacar, Deletar
Sync: Query automática ao trocar de aba (sempre atualizado)
Arquivo: src/app/admin/AdminClient.tsx

loadContents(status) → busca do banco sempre que muda aba
filteredContents → filtra por tab + busca/categoria/autor
Counts mostram dados em tempo real do array
✅ 2. Upload de Conteúdo (/admin/upload)
Tipos: Vídeo, Áudio, Texto
Upload: Via presigned URLs (R2/Cloudflare)
Progresso: Barra de progresso para vídeo e thumb
Validação: Tipo de arquivo, tamanho máximo
Status: Pendente → Fila de curadoria
Arquivo: src/app/admin/upload/UploadClient.tsx

Validação de arquivo antes de upload
Progress tracking com XMLHttpRequest
Salva no Supabase com status: 'pending'
✅ 3. Configurações de Perfil (/configuracoes)
Avatar: Upload com preview, cache bust, emoji fallback
Nome Completo: Preenchido com dados do banco, editável
Senha: Alteração segura
Logout: Encerrar sessão
Deletar Conta: Confirmação (em breve)
Arquivo: src/app/configuracoes/ConfiguracoesClient.tsx

Avatar grande 100px com overlay câmera
Nome precarregado do profile
Upload avatar → atualiza estado + banco
router.refresh() → recarrega do servidor
Arquivo: src/app/configuracoes/page.tsx

revalidate = 0 → nunca cachear
dynamic = 'force-dynamic' → sempre buscar do banco
Busca profile sem filtro de role
Init profile com nome do email se vazio
✅ 4. Home com Categorias (/)
4 Categorias: Louvor, Pregação, Crescimento, Testemunhos
Cards: Quadrados 1:1, hover effect
Cores: Off-white #F5F3F0 (suave, não forte)
Destaques: Seção com conteúdo em destaque
Arquivo: src/components/CategorySection.tsx

Cards com aspect-ratio: 1/1
Hover com translateY(-4px) e border dourada
Background: #F5F3F0 + border #E8E3DE
✅ 5. Video Cards
Layout: Thumbnail 16:9 + info
Badges: Categoria, Tipo, Destaque
Info: Título, Criador, Data, Duração
Cores: Off-white #F5F3F0
Arquivo: src/components/VideoCard.tsx

Background: #F5F3F0
Título: #222222 (não preto puro)
Criador: #666666
Play button overlay com hover
🔐 Authentication & Permissions
typescript
Copy code
// Roles disponíveis
'user'      → Usuário comum (pode fazer upload)
'admin'     → Admin (pode aprovar/rejeitar)
'superadmin' → Superadmin (controle total)

// Verificação nos componentes
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (!['user', 'admin', 'superadmin'].includes(profile.role)) {
  router.push('/') // acesso negado
}
📊 Database Schema
profiles table
sql
Copy code
id (uuid, pk)
full_name (text, nullable) -- Preenchido com nome do email no init
avatar_url (text, nullable) -- URL do storage
role (text) -- 'user' | 'admin' | 'superadmin'
managed_categories (jsonb, nullable)
managed_creators (jsonb, nullable)
created_at (timestamp)
updated_at (timestamp)
contents table
sql
Copy code
id (uuid, pk)
title (text, required)
description (text, nullable)
type (text) -- 'video' | 'audio' | 'text'
status (text) -- 'pending' | 'approved' | 'rejected'
url_media (text, nullable) -- URL do vídeo/áudio
url_thumb (text, nullable) -- URL da thumbnail
duration (text, nullable) -- Ex: "45:30"
category_id (uuid, fk)
creator_id (uuid, fk → profiles)
is_featured (boolean)
created_at (timestamp)
updated_at (timestamp)
categories table
sql
Copy code
id (uuid, pk)
name (text) -- 'Louvor', 'Pregação', etc
slug (text) -- 'louvor', 'pregacao'
color (text) -- '#B8860B'
icon (text) -- '🎵'
description (text, nullable)
🔧 API Endpoints
POST /api/upload-avatar
Upload de avatar para o usuário

typescript
Copy code
// Request
{ file: File }

// Response
{ url: string }

// Salva em: storage/avatars/{user.id}.jpg
POST /api/upload/presigned
Gera presigned URL para upload no R2

typescript
Copy code
// Request
{ fileName: string, fileType: string, uploadType: 'video' | 'thumb' }

// Response
{ presignedUrl: string, publicUrl: string }
POST /api/init-profile
Inicializa profile com dados do email

typescript
Copy code
// Request
{ full_name?: string, avatar_url?: string }

// Response
{ data: Profile }
🎯 User Flow
1. Novo Usuário
Signup → cria auth.users
Trigger cria profile com full_name = email.split('@')[0]
User vai em /configuracoes
Nome já vem preenchido ✅
Pode editar e salvar
Avatar falback é emoji com inicial
2. Upload de Conteúdo
User vai em /admin/upload
Seleciona tipo: Vídeo, Áudio, Texto
Preenche: título, descrição, categoria, duração
Upload vídeo + thumbnail (opcional)
Status: pending → fila de curadoria
3. Curadoria (Admin)
Admin vai em /admin
Vê 3 abas: Pendentes (0), Aprovados (7), Rejeitados (0)
Clica em aba → query busca dados atualizados
Filtra por categoria/autor/busca
Aprova ou Rejeita
Item sai da aba e vai pro destino
4. Visualização (Público)
Home mostra categorias
Clica em categoria → lista vídeos aprovados
Clica em vídeo → player
Vê info: criador, data, duração
🚀 Deploy Checklist
 Variáveis de ambiente (.env.local)
 Supabase database schema (SQL migrations)
 Storage buckets criados (avatars, videos, thumbs)
 RLS policies configuradas
 Trigger de profile creation ativo
 Presigned URLs working
 Avatar upload endpoint funcionando
 Upload de conteúdo working
🐛 Common Issues & Fixes
Problema: Avatar não carrega
Causa: Cache, URL quebrada Fix: Cache bust com ?t=${Date.now()}

Problema: Nome não precarrega
Causa: full_name null no banco Fix: Init profile via /api/init-profile ou trigger

Problema: Aprovados zera ao clicar
Causa: Query não filtra por tab Fix: filteredContents deve filtrar por tab === status

Problema: Branco muito forte nos cards
Causa: #FFFFFF puro Fix: Trocar para #F5F3F0 (off-white suave)

📝 Notes
Usar router.refresh() para recarregar dados do servidor
Usar revalidate = 0 + dynamic = 'force-dynamic' em páginas dinâmicas
Avatar fallback: emoji com primeira letra do nome
Category colors: Louvor #B8860B, Pregação #D4AF37, Crescimento #4CAF50, Testemunhos #7C3AED
Sempre que mudar de aba no painel, faz query nova (nunca fica desincronizado)
Off-white cards: #F5F3F0 com border #E8E3DE (mais suave que branco puro)
🔄 Last Updated
2026-09-13 01:50 UTC

✅ Painel de Curadoria funcionando (3 abas, sync automática)
✅ Upload de Conteúdo funcionando
✅ Configurações com Avatar Grande (100px) + Nome Precarregado
✅ Cards com off-white suave #F5F3F0
✅ Profile Init via email automático

oadmap

Sprint Atual

 /notificacoes — página (listar + marcar como lida)
 Player Plyr.js em /content/[id]
 <BuscaGlobal /> no Header (Ctrl+K)

Q2

 Doações (Stripe / Mercado Pago)
 Comentários moderados
 Excluir conta + alterar e-mail

Q3 — B2B Igrejas

 Salas exclusivas
 Assinatura recorrente (break-even mês 9-10)

Q4 — IA + Apps

 Whisper transcrição
 App nativo
 Busca semântica
