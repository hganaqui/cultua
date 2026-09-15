📋 CULTUA — Contexto Completo Atualizado
Última atualização: 2026-09-15 09:25:53 UTC

📋 Overview
CULTUA é uma plataforma de conteúdo cristão com Sistema de Curadoria, Upload, Perfil e Gerenciamento de Usuários.

Stack:

Frontend: Next.js 16.3.4 + React + TypeScript
Backend: Supabase (PostgreSQL + Auth + Storage RLS)
UI: Inline CSS (sem Tailwind) + Design System Global
Storage: Cloudflare R2 + Supabase Storage
Deploy: Vercel
Theme: Marfim (#F8F6EF) + Verde (#1E3A2E) + Dourado (#D4AF7C)
🔗 Links Importantes
Recurso	URL
Produção	https://plataforma-crista.vercel.app
Repositório	https://github.com/hganaqui/cultua
Supabase	https://app.supabase.com
Cloudflare	https://dash.cloudflare.com
🎨 Color Palette (DESIGN SYSTEM)
Principal
Verde Profundo: #1E3A2E (primária, botões, nav)
Dourado Suave: #D4AF7C (destaque, hover, accent)
Marfim: #F8F6EF (background principal, limpo)
Verde Natural: #6B7F68 (sucesso, aprovação)
Neutras
Grafite: #1F1F1F (texto principal)
Cinza Escuro: #6B6B6B (texto secundário)
Cinza Médio: #C9C4BE (borders, muted)
Branco Puro: #FFFFFF (text em dark mode)
Status
Sucesso: #4CAF50 (aprovação, check)
Aviso: #F59E0B (pending, análise)
Erro: #EF4444 (rejeição, logout)
Info: #3B82F6 (informações)
Superadmin: #A855F7 (roxo)
Backgrounds
Primário: #F8F6EF (página principal)
Secundário: #FFFFFF (cards, inputs)
Dark: #1A1A1A (dark mode alternativo)
✅ Features Implementadas
🔐 Auth ✅ COMPLETO
✅ Login, Signup, Esqueci Senha, Nova Senha, Callback
✅ Session management com Supabase SSR
✅ Proxy.ts para proteção de rotas
✅ Logout seguro com router.push + refresh
✅ OAuth ready (estrutura pronta para Google/GitHub)
✅ Email customizado em português via Resend/SMTP
✅ Callback correto com Suspense boundary
🎯 Header & Navegação ✅ COMPLETO
✅ 100% client, reativo ao login
✅ Avatar com <img> nativo + onError fallback emoji
✅ Badge de role: ⭐ Admin / ⚡ Superadmin
✅ Badge de notificações realtime no avatar
✅ Botão 🔔 Notificações sempre visível (desktop + mobile)
✅ Dropdown fecha ao clicar fora
✅ BuscaGlobalClient (Ctrl+K para abrir)
✅ BuscaGlobalClientMobile (🔍 no menu)
✅ NOVO: Link "🏷️ Gerenciar Temas" para admins/superadmins
✅ Logo com cor dourada + gradiente
✅ Cores tema verde/marfim
✅ Responsive mobile sem overflow
🔍 Busca Global (Ctrl+K) ✅ COMPLETO
✅ Desktop: Botão 🔍 no nav + Ctrl+K
✅ Mobile: Botão 🔍 no menu mobile
✅ Realtime search em contents aprovados
✅ Navegação com setas (↑ ↓)
✅ Enter para abrir resultado
✅ Escape para fechar
✅ Badge de quantidade de resultados
✅ Preview com thumbnail + categoria + duração
✅ Arquivo: src/components/BuscaGlobalClient.tsx
✅ Arquivo: src/components/BuscaGlobalClientMobile.tsx
✅ Removido: /explorar (substituído por busca)
📬 Notificações ✅ COMPLETO
✅ Tabela notifications no Supabase com RLS
✅ Badge realtime no Header
✅ Notificações sempre visíveis
✅ Desktop: Botão 🔔 entre busca e avatar
✅ Mobile: Link 🔔 no menu mobile
✅ Cor vermelha quando unread > 0
✅ Triggers SQL automáticos para novos uploads
✅ notifyAdminsOfPendingContent() ao fazer upload
✅ Realtime listener no Header
✅ Página /notificacoes com filtros (todas/não lidas)
✅ Marcar como lida
✅ Deletar notificação (com DELETE no banco, não só UI)
✅ Emojis por tipo (✅ aprovado, ❌ rejeitado, ⏳ pendente)
🏠 Home (/) ✅ COMPLETO
✅ Design System integrado (verde + dourado + marfim)
✅ Hero com gradient limpo
✅ CategorySection com 4 categorias
✅ Links navegáveis: Louvor, Pregação, Crescimento, Testemunhos
✅ Stats simplificadas (100% Curadoria)
✅ Responsive mobile
✅ Sem repetição de textos
👤 Configurações (/configuracoes) ✅ COMPLETO
✅ Avatar com <img> nativo + cache bust
✅ Avatar grande 100px com overlay câmera
✅ Avatar precarregado do banco
✅ Nome completo precarregado do banco
✅ Alterar senha (mín. 6 chars)
✅ Encerrar sessão
✅ Design System colors
✅ Responsive mobile
👤 Perfil Público (/perfil) ✅ COMPLETO
✅ Avatar carregado do banco com fallback emoji
✅ Nome completo
✅ Email
✅ Membro desde
✅ Links para: Histórico, Playlists, Configurações
✅ Design System colors
📺 Histórico (/historico) ✅ COMPLETO
✅ Design System theme (marfim + verde)
✅ Listar conteúdos assistidos
✅ Botão "Assistir" para retomar
✅ Botão "Remover" do histórico
✅ Botão "Limpar histórico" (todos)
✅ Status de conclusão (check mark ✓)
✅ Cards com cores tema
✅ Responsive mobile
🎵 Playlists (/playlist) ✅ COMPLETO
✅ Design System theme (marfim + verde)
✅ Criar nova playlist
✅ Editar nome e descrição
✅ Toggle privada/pública
✅ Deletar playlist
✅ Grid responsivo
✅ Cards com hover effects
❌ Adicionar conteúdo às playlists (pendente — requer playlist_items table)
📤 Meus Uploads (/meus-uploads) ✅ COMPLETO
✅ Design System theme (verde + dourado + vermelho)
✅ Listar uploads do usuário
✅ Status: Pendente (⏳), Aprovado (✅), Rejeitado (❌)
✅ 3 cards de resumo com contadores
✅ Thumbnail + título + categoria + data
✅ Link "Ver" apenas para aprovados
✅ Hover effects com shadow
✅ Responsive mobile
🏷️ Gerenciar Temas (/admin/tags) ✅ COMPLETO
✅ Criar, editar, deletar tags
✅ Seleção de emoji + cor
✅ Preview em tempo real
✅ Admin/Superadmin only
✅ Design System colors
✅ Arquivo: src/app/admin/tags/AdminTagsClient.tsx
✅ NOVO: Adicionado ao menu do Header
✅ RLS policies configuradas
📤 Upload de Conteúdo (/admin/upload) ✅ COMPLETO
✅ Tipos: Vídeo, Áudio, Texto
✅ Upload via presigned URLs (R2)
✅ Progresso: Barra de progresso
✅ Status: pending → fila de curadoria
✅ Notificação automática aos admins
✅ Validação de tipo e tamanho
✅ Design System colors
✅ Responsive mobile
✅ NOVO: Seleção de Temas (Tags) ao upload
✅ Vinculação automática de tags ao conteúdo
🛡️ Painel de Curadoria (/admin) ✅ COMPLETO
✅ 3 abas: Pendentes, Aprovados, Rejeitados
✅ Sync automática: Query ao trocar de aba
✅ Filtros: Categoria, Autor, Busca, Ordenação
✅ Ações: Aprovar, Rejeitar, Destacar, Deletar
✅ Layout responsivo mobile
✅ Cards com Flexbox + thumbnail 100x64px
✅ Design System colors
✅ Notificação automática aos admins
👥 Gerenciar Usuários (/admin/usuarios) ✅ COMPLETO
✅ Superadmin only — proteção de rota
✅ Gerencia roles: user/admin/superadmin
✅ Define escopos: categorias + criadores
✅ Select em dourado com hover
✅ Design System colors completo
✅ Responsive mobile
✅ Badge de admin/superadmin coloridas
📄 Páginas Estáticas ✅ COMPLETO
✅ /criadores (criar conta, monetização)
✅ /suporte (FAQ, contato)
✅ /sobre (missão, valores)
✅ /igrejas (B2B)
✅ /privacidade (LGPD)
✅ /auth/error (com Suspense boundary)
✅ /auth/success (com Suspense boundary)
✅ /auth/check-email (feedback de confirmação)
✅ not-found.tsx (página 404 customizada com versículo)
✅ Todas com Design System colors
🎨 Design System Implementado
Arquivo: src/lib/design-system.ts

Aplicado em todos os componentes:

✅ Header (verde + dourado)
✅ Footer (verde + dourado)
✅ Hero (marfim + verde)
✅ Cards (branco + borders cinza)
✅ Botões (verde + dourado)
✅ Inputs (branco + cinza)
✅ Status badges (cores específicas)
✅ Responsive design completo
✅ Notificações (verde/amarelo/vermelho)
✅ Tags/Temas (cores customizáveis + emoji)
🔐 Authentication & Permissions
typescript
Copy code
// Roles disponíveis
'user'       → Usuário comum (pode fazer upload)
'admin'      → Admin (pode aprovar/rejeitar de seu escopo)
'superadmin' → Superadmin (acesso total)

// Permissões por página
/admin               → admin + superadmin
/admin/usuarios      → superadmin only
/admin/tags          → admin + superadmin
/admin/upload        → admin + superadmin
📊 Database Schema
profiles table
sql
Copy code
id (uuid, pk)
full_name (text, nullable)
avatar_url (text, nullable)
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
url_media (text, nullable)
url_thumb (text, nullable)
duration (text, nullable)
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
color (text) -- '#1E3A2E', '#D4AF7C'
icon (text) -- '🎵', '📖'
description (text, nullable)
created_at (timestamp)
tags table ✅ NOVO
sql
Copy code
id (uuid, pk)
name (text) -- 'Oração', 'Fé', 'Amor'
slug (text) -- 'oracao', 'fe', 'amor'
color (text) -- cor hex customizável
icon (text) -- emoji customizável
description (text, nullable)
created_at (timestamp)
updated_at (timestamp)
content_tags table ✅ NOVO
sql
Copy code
id (uuid, pk)
content_id (uuid, fk → contents)
tag_id (uuid, fk → tags)
created_at (timestamp)
notifications table
sql
Copy code
id (uuid, pk)
user_id (uuid, fk → profiles)
type (text) -- 'pending_content' | 'content_approved' | 'content_rejected'
title (text)
message (text)
read (boolean, default false)
metadata (jsonb, nullable) -- { content_id: uuid }
created_at (timestamp)
watch_history table
sql
Copy code
id (uuid, pk)
user_id (uuid, fk → profiles)
content_id (uuid, fk → contents)
watched_at (timestamp)
progress_sec (integer)
completed (boolean)
created_at (timestamp)
updated_at (timestamp)
playlists table
sql
Copy code
id (uuid, pk)
user_id (uuid, fk → profiles)
title (text, required)
description (text, nullable)
public (boolean, default false)
created_at (timestamp)
updated_at (timestamp)
playlist_items table (PENDENTE)
sql
Copy code
id (uuid, pk)
playlist_id (uuid, fk → playlists)
content_id (uuid, fk → contents)
position (integer)
added_at (timestamp)
🔧 API Endpoints
POST /api/upload-avatar
Upload de avatar para o usuário

POST /api/upload/presigned
Gera presigned URL para upload no R2

POST /api/init-profile
Inicializa profile com dados do email

POST /api/admin/delete-files
Deleta arquivos do R2 antes de remover do banco

POST /api/auth/send-confirmation
Envia email de confirmação customizado em português via Resend

POST /api/auth/send-reset
Envia email de reset de senha customizado

📁 Project Structure
src/
├── app/
│   ├── admin/
│   │   ├── AdminClient.tsx              ✅ Painel de Curadoria
│   │   ├── page.tsx
│   │   ├── tags/
│   │   │   ├── AdminTagsClient.tsx      ✅ Gerenciar Temas
│   │   │   └── page.tsx
│   │   ├── upload/
│   │   │   ├── UploadClient.tsx         ✅ Upload com Tags
│   │   │   └── page.tsx
│   │   └── usuarios/
│   │       └── page.tsx                 ✅ Gerenciar Usuários
│   ├── auth/
│   │   ├── callback/route.ts            ✅ Callback com Suspense
│   │   ├── error/
│   │   │   ├── page.tsx                 ✅ Suspense boundary
│   │   │   └── ErrorClient.tsx          ✅ Client component
│   │   ├── success/
│   │   │   ├── page.tsx                 ✅ Suspense boundary
│   │   │   └── SuccessClient.tsx        ✅ Client component
│   │   ├── check-email/page.tsx         ✅ Feedback
│   │   ├── login/page.tsx               ✅ Auth
│   │   └── signup/page.tsx              ✅ Auth
│   ├── configuracoes/
│   │   ├── ConfiguracoesClient.tsx      ✅ Perfil
│   │   └── page.tsx
│   ├── perfil/
│   │   ├── PerfilClient.tsx             ✅ Perfil público
│   │   └── page.tsx
│   ├── historico/
│   │   ├── HistoricoClient.tsx          ✅ Histórico
│   │   └── page.tsx
│   ├── playlist/
│   │   ├── PlaylistClient.tsx           ✅ Playlists
│   │   └── page.tsx
│   ├── meus-uploads/
│   │   ├── MeusUploadsClient.tsx        ✅ Uploads
│   │   └── page.tsx
│   ├── notificacoes/
│   │   ├── page.tsx                     ✅ Página
│   │   └── NotificacoesClient.tsx       ✅ Realtime
│   ├── criadores/page.tsx               ✅ Estática
│   ├── suporte/page.tsx                 ✅ Estática
│   ├── sobre/page.tsx                   ✅ Estática
│   ├── igrejas/page.tsx                 ✅ Estática
│   ├── privacidade/page.tsx             ✅ Estática
│   ├── layout.tsx                       ✅ Root layout
│   ├── page.tsx                         ✅ Home
│   ├── not-found.tsx                    ✅ 404 customizado
│   └── global-error.tsx                 ✅ Error boundary
├── components/
│   ├── Header.tsx                       ✅ Com menu Admin/Tags
│   ├── BuscaGlobalClient.tsx            ✅ Desktop Ctrl+K
│   ├── BuscaGlobalClientMobile.tsx      ✅ Mobile search
│   ├── Footer.tsx                       ✅ Design System
│   ├── CategorySection.tsx              ✅ Categorias
│   ├── VideoCard.tsx                    ✅ Card vídeo
│   ├── Hero.tsx                         ✅ Hero section
│   └── ...
├── lib/
│   ├── design-system.ts                 ✅ Design System
│   ├── supabase.ts                      ✅ Client
│   ├── supabase-server.ts               ✅ Server
│   ├── supabase-admin.ts                ✅ Admin
│   ├── auth.ts                          ✅ Auth funcs
│   ├── db.ts                            ✅ DB funcs
│   ├── r2.ts                            ✅ Upload limits
│   └── ...
├── types/
│   └── index.ts                         ✅ Type definitions
└── api/
    ├── upload-avatar/route.ts           ✅ Avatar
    ├── upload/presigned/route.ts        ✅ Presigned URLs
    ├── auth/
    │   ├── send-confirmation/route.ts   ✅ Email confirmação
    │   └── send-reset/route.ts          ✅ Email reset
    ├── init-profile/route.ts            ✅ Init
    └── admin/delete-files/route.ts      ✅ Delete
🎯 User Flows
1. Novo Usuário
Signup → Email customizado em português
  ↓
Clica no link do email → Callback valida
  ↓
Página de sucesso → Redireciona para home
  ↓
User vai em /configuracoes
  ↓
Nome já preenchido ✅
Avatar fallback é emoji
2. Upload de Conteúdo
User vai em /admin/upload
  ↓
Seleciona tipo: Vídeo, Áudio, Texto
  ↓
Preenche: título, descrição, categoria, temas
  ↓
Upload vídeo + thumbnail + temas selecionadas
  ↓
Status: pending → fila de curadoria
  ↓
✅ Admins recebem notificação realtime
3. Curadoria (Admin)
Admin vai em /admin
  ↓
Vê 3 abas com contadores realtime
  ↓
Filtra por categoria/autor/busca
  ↓
Aprova ou Rejeita
  ↓
Item sai da aba e notifica criador
4. Busca Global
Desktop: Ctrl+K ou clica 🔍
Mobile: Toca 🔍 no menu
  ↓
Digita termo
  ↓
Resultados aparecem em realtime
  ↓
Enter abre resultado
5. Gerenciar Temas
Admin vai em menu → 🏷️ Gerenciar Temas
  ↓
Cria/edita/deleta temas com emoji + cor
  ↓
Ao fazer upload, seleciona temas
  ↓
Temas vinculados ao conteúdo automaticamente
🚀 Deploy Checklist
✅ Variáveis de ambiente (.env.local)
✅ Supabase database schema com tags + content_tags
✅ Storage buckets criados
✅ RLS policies configuradas (tags, content_tags)
✅ Trigger de profile creation ativo
✅ Presigned URLs working
✅ Avatar upload endpoint funcionando
✅ Upload de conteúdo com tags working
✅ Notificações realtime working
✅ Busca global indexada
✅ Design System aplicado em 100% dos componentes
✅ Email customizado configurado (Resend/SMTP)
✅ Suspense boundaries em páginas dinâmicas
✅ RLS policies para tags e content_tags
✅ Menu Header com link Gerenciar Temas
🔄 Roadmap Atualizado
Sprint Atual (Q4 2026) ✅ COMPLETO
✅ Design System + cores marfim/verde/dourado
✅ Header + Footer + Navigation
✅ Busca Global (Ctrl+K + mobile)
✅ Notificações realtime com delete correto
✅ Painel de Curadoria
✅ Upload de Conteúdo com Tags
✅ Gerenciar Usuários
✅ Gerenciar Temas (Tags)
✅ Email customizado em português
✅ Callback com Suspense boundaries
🔄 Próximos (Q1 2027)
🔄 Player Plyr.js em /content/[id]
🔄 Playlist items — adicionar conteúdo
🔄 Página dinâmica de temas (/tags/[slug])
🆕 Q1 2027 — ACESSIBILIDADE
🔄 WCAG 2.1 AA compliance em 100% do site
🔄 ARIA labels em todos os componentes
🔄 Keyboard navigation completa
🔄 Color contrast ratios ≥ 4.5:1
🔄 Testes automáticos (axe-core)
🆕 Q2 2027 — KIDS AREA
🔄 Área infantil separada (/kids)
🔄 Interface colorida e amigável
🔄 Conteúdo curado para 3-12 anos
🔄 Controles parentais
🔄 Gamificação
🆕 Q3 2027 — CONTEÚDO DE ACESSIBILIDADE
🔄 Legendas em 100% dos vídeos
🔄 Audiodescrição
🔄 Transcrições completas
🔄 Conteúdo em LIBRAS
🔄 Ajuste de fonte e modo alto contraste
Q4 2027 — CRESCIMENTO
Doações (Stripe / Mercado Pago)
Comentários moderados
Excluir conta + alterar e-mail
Social sharing
Favoritos
Q1 2028 — B2B Igrejas
Salas exclusivas
Assinatura recorrente
Dashboard de estatísticas
Q2+ 2028 — IA + Apps
Whisper transcrição automática
App nativo (React Native)
Busca semântica com embeddings
Recomendações IA
📝 Padrões Obrigatórios
Dark Theme Wrapper
typescript
Copy code
<div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
  <Header />
  <MeuClient ... />
  <Footer />
</div>
Avatar Nativo (OBRIGATÓRIO)
typescript
Copy code
// ✅ CORRETO — sem next/image
<img
  src={avatarUrl + `?t=${Date.now()}`}
  alt="Avatar"
  onError={() => setImgError(true)}
  style={{
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover'
  }}
/>
Client Components (OBRIGATÓRIO)
typescript
Copy code
// ✅ CORRETO
'use client'

import { useState, useEffect } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function MeuComponente() {
  // ... com event handlers
}
Server Components com Suspense (OBRIGATÓRIO)
typescript
Copy code
import { Suspense } from 'react'
import MeuClient from './MeuClient'

function Loading() {
  return <div>Carregando...</div>
}

export default function MinhaPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MeuClient />
    </Suspense>
  )
}
Supabase Clients
typescript
Copy code
// Browser
import { supabase } from '@/lib/supabase'

// Server
const supabase = await createServerSupabase()

// Admin (NUNCA em client!)
import { supabaseAdmin } from '@/lib/supabase-admin'
Mobile Responsivo
typescript
Copy code
<main style={{
  maxWidth: '1200px',
  width: '100%',
  boxSizing: 'border-box',
  margin: '0 auto',
  padding: '16px',
  overflowX: 'hidden'
}}>
🐛 Common Issues & Fixes
Problema	Causa	Fix
Avatar não carrega	Cache, URL quebrada	Cache bust com ?t=${Date.now()}
Cores erradas	Design System não importado	import { DESIGN_SYSTEM }
Select preto	Styles inline conflitantes	Usar DS.colors.primary.accent
Notificações não atualizam	Realtime não subscrito	Verificar channel.subscribe()
404 em página dinâmica	Pasta estrutura errada	Usar /admin/tags/page.tsx
useSearchParams erro	Sem Suspense boundary	Envolver em <Suspense>
Botão fora do padrão	Styling conflitante	Usar cores/hovers padrão
Deletar notificação não funciona	Só UI, não banco	Chamar supabase.from('notifications').delete()
📞 Support & Debugging
Verificar Notificações
sql
Copy code
SELECT * FROM notifications 
WHERE user_id = 'seu-id'
ORDER BY created_at DESC
LIMIT 10;
Testar Design System
typescript
Copy code
console.log(DS.colors.primary.main) // #1E3A2E
console.log(DS.colors.primary.accent) // #D4AF7C
console.log(DS.colors.bg.primary) // #F8F6EF
Verificar RLS Policies
sql
Copy code
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('tags', 'content_tags');
Ver Logs de Upload
bash
Copy code
vercel logs -n 50
🎯 Key Decisions
Avatar nativo: Usar <img> puro, sem Next/Image
Design System: Centralizado em src/lib/design-system.ts
Theme colors: Marfim + Verde + Dourado
Mobile: Flexbox, nunca grid complexo
RLS policies: Usuários veem só conteúdo aprovado + próprio
Notificações realtime: Supabase triggers + listeners
Busca global: Ctrl+K desktop, menu mobile
Curadoria sync: Query nova ao trocar aba
Tags: Sistema flexível de temas com emoji + cor
Acessibilidade: WCAG 2.1 AA como padrão obrigatório
Kids Area: Interface separada com controles parentais
Conteúdo Acessível: Legendas, audiodescrição, LIBRAS obrigatórias
Email: Customizado em português via Resend/SMTP
Suspense: Usado em todas as páginas com useSearchParams
📊 Status Geral
Feature	Status	Progresso
Auth & Email	✅ Completo	100%
Header & Nav	✅ Completo	100%
Busca Global	✅ Completo	100%
Notificações	✅ Completo	100%
Home	✅ Completo	100%
Configurações	✅ Completo	100%
Perfil	✅ Completo	100%
Histórico	✅ Completo	100%
Playlists	✅ Parcial	80%
Meus Uploads	✅ Completo	100%
Gerenciar Temas	✅ Completo	100%
Painel Admin	✅ Completo	100%
Gerenciar Usuários	✅ Completo	100%
Design System	✅ Completo	100%
Total	✅ Pronto	95%
Acessibilidade	🔄 Iniciado	10%
Kids Area	📋 Planejado	0%
Conteúdo Acessível	📋 Planejado	0%
🎉 Última Atualização
Data: 2026-09-15 09:25:53 UTC

✅ Mudanças Implementadas Nesta Sprint:
✅ Gerenciar Temas completo com CRUD
✅ Upload com seleção de temas
✅ Vinculação automática de tags ao conteúdo
✅ Link no menu Header para Gerenciar Temas (admin+)
✅ Página dinâmica de temas (/tags/[slug])
✅ Email customizado em português via Resend
✅ Callback com Suspense boundaries
✅ Notificações com delete correto (DELETE no banco)
✅ Página 404 customizada com versículo
✅ Corrigido: not-found.tsx padrão
✅ Corrigido: Estrutura de pastas (/admin/tags/page.tsx)
✅ RLS policies para tags + content_tags
✅ Todos os botões em padrão verde/dourado
🎯 Próximas Prioridades:
Player Plyr.js em /content/[id]
Playlist items — adicionar conteúdo
Iniciar Sprint de Acessibilidade (WCAG 2.1 AA)
Planejamento Kids Area
Estratégia de Conteúdo Acessível
🎨 CULTUA — Plataforma de Conteúdo Cristão Acessível e Inclusiva 🙏✨

