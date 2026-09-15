📋 CULTUA — Contexto Completo Atualizado
Última atualização: 2026-09-15 16:38:52 UTC

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
Categorias (SVGs 28x28px coloridos)
Louvor: #7C3AED (roxo)
Pregação: #D4A373 (dourado claro)
Crescimento: #0F3D2E (verde escuro)
Testemunhos: #D97706 (âmbar)
Família: #D4AF7C (dourado)
Estudos: #6B7F6B (verde natural)
Neutras
Grafite: #1F1F1F (texto principal)
Cinza Escuro: #6B6B6B (texto secundário)
Cinza Médio: #C9C4BE (borders, muted)
Branco Puro: #FFFFFF (text em dark mode)
Status
Sucesso: #6B7F6B (aprovação, check)
Aviso: #D4A373 (pending, análise)
Erro: #C84C3C (rejeição, logout)
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
✅ 6 categorias na navbar com SVGs 28x28px:
Louvor (roxo)
Pregação (dourado)
Crescimento (verde)
Testemunhos (âmbar)
Família (dourado)
Estudos (verde natural)
✅ Ícone + Label em cada link de categoria
✅ Avatar com <img> nativo + onError fallback emoji
✅ Badge de role: ⭐ Admin / ⚡ Superadmin
✅ Badge de notificações realtime no avatar
✅ Botão 🔔 Notificações sempre visível (desktop + mobile)
✅ Dropdown fecha ao clicar fora
✅ BuscaGlobalClient (Ctrl+K para abrir)
✅ BuscaGlobalClientMobile (🔍 no menu)
✅ Link "🏷️ Gerenciar Temas" para admins/superadmins
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
✅ Deletar notificação (DELETE no banco, não só UI)
✅ Emojis por tipo (✅ aprovado, ❌ rejeitado, ⏳ pendente)
🏠 Home (/) ✅ COMPLETO
✅ Design System integrado (verde + dourado + marfim)
✅ Hero com gradient limpo
✅ CategorySection com 6 categorias:
Louvor (roxo)
Pregação (dourado claro)
Crescimento (verde escuro)
Testemunhos (âmbar)
Família (dourado)
Estudos (verde natural)
✅ Cards coloridos (background + border baseados no ícone da categoria)
✅ SVGs 28x28px em container colorido
✅ Underline colorido em cada card
✅ Grid 6 colunas → 3 colunas → 2 colunas → 1 coluna (responsivo)
✅ Seção "Buscar por Tema" com tags dinâmicas do banco
✅ Destaques da semana (6 conteúdos featured)
✅ Links navegáveis
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
✅ Plano: Gratuito
✅ Status: Ativo
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
✅ Seleção de emoji + cor customizável
✅ Preview em tempo real
✅ Admin/Superadmin only
✅ Design System colors
✅ Adicionado ao menu do Header
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
✅ Seleção de Temas (Tags) ao upload
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
🎨 Design System Implementado ✅ COMPLETO
Arquivo: src/lib/design-system.ts

Aplicado em todos os componentes:

✅ Header (verde + dourado + 6 categorias com SVGs)
✅ Footer (verde + dourado + 6 categorias com SVGs)
✅ Hero (marfim + verde)
✅ Cards (branco + borders cinza)
✅ CategorySection (6 categorias com cores dinâmicas)
✅ Botões (verde + dourado)
✅ Inputs (branco + cinza)
✅ Status badges (cores específicas)
✅ Responsive design completo
✅ Notificações (verde/amarelo/vermelho)
✅ Tags/Temas (cores customizáveis + emoji)
🎨 SVGs Implementados ✅ COMPLETO
Local: public/icons/

Arquivos:

✅ louvor.svg (#7C3AED)
✅ pregacao.svg (#D4A373)
✅ crescimento.svg (#0F3D2E)
✅ testemunhos.svg (#D97706)
✅ familia.svg (#D4AF7C)
✅ estudos.svg (#6B7F6B)
Implementados em:

✅ Header navbar (28x28px com labels)
✅ CategorySection (28x28px em containers coloridos)
✅ Footer (com labels)
✅ Página de categoria (/categoria/[slug])
🔐 Authentication & Permissions
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
🔧 API Endpoints
POST /api/upload-avatar — Upload de avatar para o usuário
POST /api/upload/presigned — Gera presigned URL para upload no R2
POST /api/init-profile — Inicializa profile com dados do email
POST /api/admin/delete-files — Deleta arquivos do R2 antes de remover do banco
POST /api/auth/send-confirmation — Envia email de confirmação customizado em português via Resend
POST /api/auth/send-reset — Envia email de reset de senha customizado
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
│   │   ├── error/, success/, check-email/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── categoria/[slug]/
│   │   ├── CategoriaClient.tsx          ✅ Página de categoria com SVGs
│   │   └── page.tsx
│   ├── configuracoes/, perfil/, historico/
│   │   └── page.tsx (com Client components)
│   ├── playlist/, meus-uploads/
│   │   └── page.tsx (com Client components)
│   ├── notificacoes/
│   │   ├── page.tsx                     ✅ Página
│   │   └── NotificacoesClient.tsx       ✅ Realtime
│   ├── tags/[slug]/
│   │   ├── TagsPageClient.tsx           ✅ Página dinâmica de temas
│   │   └── page.tsx
│   ├── tags/
│   │   └── page.tsx                     ✅ Lista de temas
│   ├── explorar/
│   │   ├── ExplorarClient.tsx           ✅ Explorar com 6 categorias
│   │   └── page.tsx
│   ├── criadores/, suporte/, sobre/, igrejas/, privacidade/
│   │   └── page.tsx (páginas estáticas)
│   ├── layout.tsx                       ✅ Root layout com Header/Footer
│   ├── page.tsx                         ✅ Home com 6 categorias
│   ├── not-found.tsx                    ✅ 404 customizado
│   └── global-error.tsx                 ✅ Error boundary
├── components/
│   ├── Header.tsx                       ✅ Com 6 categorias + SVGs 28px
│   ├── HeaderClient.tsx                 ✅ Client component com realtime
│   ├── BuscaGlobalClient.tsx            ✅ Desktop Ctrl+K
│   ├── BuscaGlobalClientMobile.tsx      ✅ Mobile search
│   ├── Footer.tsx                       ✅ Com 6 categorias + SVGs
│   ├── CategorySection.tsx              ✅ 6 categorias com cards coloridos
│   ├── VideoCard.tsx                    ✅ Card vídeo
│   └── Hero.tsx                         ✅ Hero section
├── lib/
│   ├── design-system.ts                 ✅ Design System
│   ├── supabase.ts, supabase-server.ts, supabase-admin.ts
│   ├── auth.ts, db.ts, r2.ts
│   └── ...
├── types/
│   └── index.ts                         ✅ Type definitions
├── public/icons/                        ✅ SVGs
│   ├── louvor.svg
│   ├── pregacao.svg
│   ├── crescimento.svg
│   ├── testemunhos.svg
│   ├── familia.svg
│   └── estudos.svg
└── api/
    ├── upload-avatar/route.ts
    ├── upload/presigned/route.ts
    ├── auth/send-confirmation/route.ts
    ├── auth/send-reset/route.ts
    ├── init-profile/route.ts
    └── admin/delete-files/route.ts
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
2. Explorar Categorias
User vê 6 categorias na home:
  - Louvor (roxo)
  - Pregação (dourado)
  - Crescimento (verde)
  - Testemunhos (âmbar)
  - Família (dourado)
  - Estudos (verde natural)
  ↓
Clica em categoria
  ↓
Vê conteúdos aprovados daquela categoria
  ↓
Com SVG colorido no header
3. Upload de Conteúdo
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
4. Curadoria (Admin)
Admin vai em /admin
  ↓
Vê 3 abas com contadores realtime
  ↓
Filtra por categoria/autor/busca
  ↓
Aprova ou Rejeita
  ↓
Item sai da aba e notifica criador
5. Busca Global
Desktop: Ctrl+K ou clica 🔍
Mobile: Toca 🔍 no menu
  ↓
Digita termo
  ↓
Resultados aparecem em realtime
  ↓
Enter abre resultado
📊 Status Geral
Feature	Status	Progresso
Auth & Email	✅ Completo	100%
Header & Nav (6 categorias + SVGs 28px)	✅ Completo	100%
Busca Global	✅ Completo	100%
Notificações	✅ Completo	100%
Home (6 categorias + cards coloridos)	✅ Completo	100%
Configurações	✅ Completo	100%
Perfil	✅ Completo	100%
Histórico	✅ Completo	100%
Playlists	✅ Parcial	80%
Meus Uploads	✅ Completo	100%
Gerenciar Temas	✅ Completo	100%
Painel Admin	✅ Completo	100%
Gerenciar Usuários	✅ Completo	100%
Design System	✅ Completo	100%
SVGs (6 categorias)	✅ Completo	100%
Categorias dinâmicas	✅ Completo	100%
TOTAL	✅ Pronto	97%
Acessibilidade	🔄 Iniciado	10%
Kids Area	📋 Planejado	0%
Player Plyr.js	📋 Planejado	0%
🎉 Última Atualização
Data: 2026-09-15 16:38:52 UTC

✅ Mudanças Implementadas Nesta Sprint:
✅ 6 categorias em todo o projeto
✅ SVGs 28x28px em navbar
✅ SVGs 28x28px em CategorySection com cards coloridos
✅ SVGs em Footer
✅ Página dinâmica /categoria/[slug] com SVGs
✅ Página dinâmica /tags/[slug]
✅ CategorySection com background + border coloridos
✅ Cards com cores dinâmicas baseadas no ícone
✅ Gerenciar Temas completo com CRUD
✅ Upload com seleção de temas
✅ Vinculação automática de tags ao conteúdo
✅ Link no menu Header para Gerenciar Temas (admin+)
✅ Email customizado em português via Resend
✅ Callback com Suspense boundaries
✅ Notificações com delete correto (DELETE no banco)
✅ Página 404 customizada com versículo
✅ RLS policies para tags + content_tags
✅ Todos os botões em padrão verde/dourado
🎯 Próximas Prioridades:
Player Plyr.js em /content/[id]
Playlist items — adicionar conteúdo
Iniciar Sprint de Acessibilidade (WCAG 2.1 AA)
Planejamento Kids Area
Estratégia de Conteúdo Acessível
🎨 CULTUA — Plataforma de Conteúdo Cristão Acessível e Inclusiva 🙏✨
Status: 97% completo e pronto para produção. Próximo: Player de vídeo + Acessibilidade WCAG 2.1 AA