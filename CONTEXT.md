📋 CULTUA — Contexto Completo Atualizado
Última atualização: 2026-09-14 23:17 UTC

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
🎯 Header & Navegação ✅ COMPLETO
✅ 100% client, reativo ao login
✅ Avatar com <img> nativo + onError fallback emoji
✅ Badge de role: ⭐ Admin / ⚡ Superadmin
✅ Badge de notificações realtime no avatar
✅ Botão 🔔 Notificações sempre visível (desktop + mobile)
✅ Dropdown fecha ao clicar fora
✅ BuscaGlobalClient (Ctrl+K para abrir)
✅ BuscaGlobalClientMobile (🔍 no menu)
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
📬 Notificações ✅ PARCIALMENTE COMPLETO
✅ Tabela notifications no Supabase com RLS
✅ Badge realtime no Header
✅ Notificações sempre visíveis (não só quando unread > 0)
✅ Desktop: Botão 🔔 entre busca e avatar
✅ Mobile: Link 🔔 no menu mobile
✅ Cor vermelha quando unread > 0
✅ Triggers SQL automáticos para novos uploads
✅ notifyAdminsOfPendingContent() ao fazer upload
✅ Realtime listener no Header
✅ Página /notificacoes com filtros (todas/não lidas)
✅ Marcar como lida
✅ Deletar notificação
✅ Emojis por tipo (✅ aprovado, ❌ rejeitado, ⏳ pendente)
❌ Notificação ao aprovar/rejeitar (a implementar)
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
🛡️ Painel de Curadoria (/admin) ✅ COMPLETO
✅ 3 abas: Pendentes, Aprovados, Rejeitados
✅ Sync automática: Query ao trocar de aba
✅ Filtros: Categoria, Autor, Busca, Ordenação
✅ Ações: Aprovar, Rejeitar, Destacar, Deletar
✅ Layout responsivo mobile (sem canto branco)
✅ Cards com Flexbox + thumbnail 100x64px
✅ Design System colors
✅ Dark theme alternativo
✅ Notificação automática aos admins
📤 Upload de Conteúdo (/admin/upload) ✅ COMPLETO
✅ Tipos: Vídeo, Áudio, Texto
✅ Upload via presigned URLs (R2)
✅ Progresso: Barra de progresso
✅ Status: pending → fila de curadoria
✅ Notificação automática aos admins
✅ Validação de tipo e tamanho
✅ Design System colors
✅ Responsive mobile
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
✅ Todas com 'use client' e Design System colors
🎨 Design System Implementado
Arquivo: src/lib/design-system.ts

typescript
Copy code
export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      main: '#1E3A2E',        // Verde profundo
      light: '#2D5A45',       // Verde mais claro
      dark: '#0F1F1A',        // Verde muito escuro
      accent: '#D4AF7C',      // Dourado suave
    },
    secondary: {
      success: '#6B7F68',     // Verde natural
      warning: '#F59E0B',     // Amarelo/Aviso
      error: '#C84C3C',       // Vermelho-cobre
      info: '#2D5A45',        // Verde médio
    },
    neutral: {
      marfim: '#F8F6EF',      // Marfim claro
      light: '#E8E3DE',       // Bege claro
      medium: '#C9C4BE',      // Cinza médio
      dark: '#6B6B6B',        // Cinza escuro
      charcoal: '#3F3F3F',    // Carvão
      graphite: '#1F1F1F',    // Grafite
    },
    bg: {
      primary: '#F8F6EF',     // Marfim (fundo principal)
      secondary: '#FFFFFF',   // Branco puro
      dark: '#1A1A1A',        // Dark mode
      accent: '#2D5A45',      // Verde médio
    },
    text: {
      dark: '#1F1F1F',        // Grafite - texto principal
      light: '#FFFFFF',       // Branco - texto em fundo escuro
      primary: '#1F1F1F',     // Grafite
      secondary: '#6B6B6B',   // Cinza escuro
      tertiary: '#999999',    // Cinza médio
      muted: '#C9C4BE',       // Cinza claro
    }
  },
  // ... typography, spacing, shadows, etc
}
Aplicado em todos os componentes:

✅ Header (verde + dourado)
✅ Footer (verde + dourado)
✅ Hero (marfim + verde)
✅ Cards (branco + borders cinza)
✅ Botões (verde + dourado)
✅ Inputs (branco + cinza)
✅ Status badges (cores específicas)
✅ Responsive design completo
🔐 Authentication & Permissions
typescript
Copy code
// Roles disponíveis
'user'       → Usuário comum (pode fazer upload)
'admin'      → Admin (pode aprovar/rejeitar de seu escopo)
'superadmin' → Superadmin (acesso total)
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

📁 Project Structure
src/
├── app/
│   ├── admin/
│   │   ├── AdminClient.tsx              ✅ Painel de Curadoria
│   │   └── page.tsx
│   ├── admin/upload/
│   │   ├── UploadClient.tsx             ✅ Upload de conteúdo
│   │   └── page.tsx
│   ├── admin/usuarios/
│   │   └── page.tsx                     ✅ Gerenciar usuários
│   ├── configuracoes/
│   │   ├── ConfiguracoesClient.tsx      ✅ Perfil do usuário
│   │   └── page.tsx
│   ├── perfil/
│   │   ├── PerfilClient.tsx             ✅ Perfil público
│   │   └── page.tsx
│   ├── historico/
│   │   ├── HistoricoClient.tsx          ✅ Histórico
│   │   └── page.tsx
│   ├── playlist/
│   │   ├── PlaylistClient.tsx           ✅ Gerenciar playlists
│   │   └── page.tsx
│   ├── meus-uploads/
│   │   ├── MeusUploadsClient.tsx        ✅ Uploads do usuário
│   │   └── page.tsx
│   ├── notificacoes/
│   │   ├── page.tsx                     ✅ Página de notificações
│   │   └── NotificacoesClient.tsx       ✅ Componente realtime
│   ├── criadores/
│   │   └── page.tsx                     ✅ Página estática
│   ├── suporte/
│   │   └── page.tsx                     ✅ Central de suporte
│   ├── sobre/
│   │   └── page.tsx                     ✅ Sobre a plataforma
│   ├── igrejas/
│   │   └── page.tsx                     ✅ Para Igrejas (B2B)
│   ├── privacidade/
│   │   └── page.tsx                     ✅ Política de privacidade
│   ├── layout.tsx                        ✅ Root layout com Design System
│   └── page.tsx                          ✅ Home com CategorySection
├── components/
│   ├── Header.tsx                        ✅ Com notificações + busca
│   ├── BuscaGlobalClient.tsx             ✅ Busca desktop (Ctrl+K)
│   ├── BuscaGlobalClientMobile.tsx       ✅ Busca mobile
│   ├── Footer.tsx                        ✅ Com Design System
│   ├── CategorySection.tsx               ✅ Categorias
│   ├── VideoCard.tsx                     ✅ Card de vídeo
│   ├── Hero.tsx                          ✅ Hero section
│   └── ...
├── lib/
│   ├── design-system.ts                 ✅ Design System global
│   ├── supabase.ts                      Client Supabase
│   ├── supabase-server.ts               Server Supabase
│   ├── supabase-admin.ts                Admin Supabase
│   ├── auth.ts                          Funções de auth
│   ├── db.ts                            Funções de banco
│   │   └── notifyAdminsOfPendingContent() ✅ Notifica admins
│   ├── r2.ts                            Upload limits config
│   ├── cultua-config.ts                 Config colors & constants
│   └── ...
├── styles/
│   ├── cultua.css                       ✅ CSS variables + resets
│   ├── globals.css                      ✅ Tailwind + custom components
│   └── ...
├── types/
│   └── index.ts                         Type definitions
└── api/
    ├── upload-avatar/route.ts            ✅ Upload avatar
    ├── upload/presigned/route.ts         ✅ Presigned URLs
    ├── init-profile/route.ts             ✅ Init profile
    ├── admin/delete-files/route.ts       ✅ Delete de arquivos
    └── ...
🎯 User Flows
1. Novo Usuário
Signup → cria auth.users
  ↓
Trigger cria profile com full_name = email.split('@')[0]
  ↓
User vai em /configuracoes
  ↓
Nome já vem preenchido ✅
Avatar fallback é emoji
2. Upload de Conteúdo
User vai em /admin/upload
  ↓
Seleciona tipo: Vídeo, Áudio, Texto
  ↓
Preenche: título, descrição, categoria
  ↓
Upload vídeo + thumbnail
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
Item sai da aba
4. Busca Global
Desktop: Ctrl+K ou clica 🔍
Mobile: Toca 🔍 no menu
  ↓
Digita termo
  ↓
Resultados aparecem em realtime
  ↓
Enter abre resultado
🚀 Deploy Checklist
✅ Variáveis de ambiente (.env.local)
✅ Supabase database schema
✅ Storage buckets criados
✅ RLS policies configuradas
✅ Trigger de profile creation ativo
✅ Presigned URLs working
✅ Avatar upload endpoint funcionando
✅ Upload de conteúdo working
✅ Notificações realtime working
✅ Busca global indexada
✅ Design System aplicado em 100% dos componentes
🔄 Roadmap Atualizado
Sprint Atual (Q4 2026)
✅ Design System + cores marfim/verde/dourado
✅ Header + Footer + Navigation
✅ Busca Global (Ctrl+K + mobile)
✅ Notificações realtime
✅ Painel de Curadoria
✅ Upload de Conteúdo
✅ Gerenciar Usuários
🔄 Player Plyr.js em /content/[id]
🔄 Playlist items — adicionar conteúdo
🆕 Q1 2027 — ACESSIBILIDADE
🔄 WCAG 2.1 AA compliance em 100% do site

ARIA labels em todos os componentes
Keyboard navigation (Tab, Enter, Escape)
Focus management
Color contrast ratios ≥ 4.5:1
Text alternatives para imagens
Form validation com mensagens acessíveis
Skip links para navegação
Semantic HTML (buttons, labels, headings)
Screen reader testing (NVDA, JAWS)
Mobile accessibility (touch targets 48x48px)
🔄 Documentação de Acessibilidade

Guia de contribução acessível
Checklist de acessibilidade
Testes automáticos (axe-core)
🆕 Q2 2027 — KIDS AREA
🔄 Área Infantil Separada (/kids)
Interface colorida e amigável
Conteúdo curado para crianças (3-12 anos)
Modo parental com controles
Design simplificado
Letras maiores
Animações suaves
Sem publicidade
Timer de uso (controle parental)
Categorias infantis:
🎵 Louvor Kids
📖 Histórias Bíblicas
🎨 Artesanato Cristão
🎮 Jogos Educativos
Gamificação (badges, pontos)
Pais podem gerenciar acesso
🆕 Q3 2027 — CONTEÚDO DE ACESSIBILIDADE
🔄 Nova Categoria: Acessibilidade

✅ Legendas em 100% dos vídeos
🔄 Audiodescrição em vídeos
🔄 Transcrições completas
🔄 Conteúdo em LIBRAS (intérprete)
🔄 Conteúdo para surdocegos
🔄 Devocionais com leitura facilitada
🔄 Conteúdo para pessoas com deficiência visual
🔄 Conteúdo para pessoas com deficiência intelectual
🔄 Preacher notes com fonte clara + espaçamento
🔄 Features de Acessibilidade

Ajuste de tamanho de fonte (A+ A-)
Modo alto contraste
Modo noturno
Modo dyslexia-friendly (fonte Comic Sans/Arial)
Redução de animações
Pausas entre parágrafos na leitura
Leitor de tela otimizado
Q4 2027 — CRESCIMENTO
Doações (Stripe / Mercado Pago)
Comentários moderados
Excluir conta + alterar e-mail
Social sharing
Favoritos
Recomendações IA
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
Cores erradas	Design System não importado	import { DESIGN_SYSTEM } from '@/lib/design-system'
Select preto	Styles inline conflitantes	Usar DS.colors.primary.accent
Notificações não atualizam	Realtime não subscrito	Verificar channel.subscribe()
Busca lenta	Sem índices	Criar índice em contents(title, description)
Mobile com canto branco	Flex + overflow	overflowX: 'hidden' no main
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
// Verificar se cores estão corretas
console.log(DS.colors.primary.main) // #1E3A2E
console.log(DS.colors.primary.accent) // #D4AF7C
console.log(DS.colors.bg.primary) // #F8F6EF
Ver Logs de Upload
bash
Copy code
vercel logs -n 50
🎯 Key Decisions
Avatar nativo: Usar <img> puro, sem Next/Image (mais simples)
Design System: Centralizado em src/lib/design-system.ts
Theme colors: Marfim (#F8F6EF) + Verde (#1E3A2E) + Dourado (#D4AF7C)
Mobile: Flexbox, nunca grid complexo
RLS policies: Usuários veem só conteúdo aprovado + próprio
Notificações realtime: Supabase triggers + listeners
Busca global: Ctrl+K desktop, menu mobile
Curadoria sync: Query nova ao trocar aba
Acessibilidade: WCAG 2.1 AA como padrão obrigatório
Kids Area: Interface separada com controles parentais
Conteúdo Acessível: Legendas, audiodescrição, LIBRAS obrigatórias
📊 Status Geral
Feature	Status	Progresso
Auth & Login	✅ Completo	100%
Header & Nav	✅ Completo	100%
Busca Global	✅ Completo	100%
Notificações	✅ Parcial	80%
Home	✅ Completo	100%
Configurações	✅ Completo	100%
Perfil	✅ Completo	100%
Histórico	✅ Completo	100%
Playlists	✅ Parcial	80%
Meus Uploads	✅ Completo	100%
Painel Admin	✅ Completo	100%
Gerenciar Usuários	✅ Completo	100%
Design System	✅ Completo	100%
Acessibilidade	🔄 Iniciado	10%
Kids Area	📋 Planejado	0%
Conteúdo Acessível	📋 Planejado	0%
🎉 Última Atualização
Data: 2026-09-14 23:17 UTC

Mudanças Implementadas Hoje:

✅ Design System global com cores corretas (Marfim + Verde + Dourado)
✅ Todas as páginas atualizadas com Design System
✅ Header + Footer em verde + dourado
✅ Cards com borders e hovers corretos
✅ Notificações com emojis ao invés de "Check/Box"
✅ Gerenciar Usuários com select em dourado
✅ Meus Uploads com cores verde/dourado/vermelho
✅ Histórico com Design System colors
✅ Playlists com Design System colors
✅ Todas as páginas estáticas com 'use client'
✅ Hero limpo sem repetições
✅ Roadmap atualizado com Acessibilidade, Kids Area, Conteúdo Acessível
Próximas Prioridades:

Player Plyr.js em /content/[id]
Playlist items adicionar conteúdo
Iniciar Sprint de Acessibilidade (WCAG 2.1 AA)
Planejamento Kids Area
Estratégia de Conteúdo Acessível
🎨 CULTUA — Plataforma de Conteúdo Cristão Acessível e Inclusiva 🙏✨