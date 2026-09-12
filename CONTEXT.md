# CULTUA — Contexto para novo chat

## Repositório
https://github.com/hganaqui/cultua

## Produção
https://plataforma-crista.vercel.app

## Stack
Next.js 16.3.4 + TypeScript + Supabase + Cloudflare R2 + Vercel + Tailwind CSS

---

## O que já está feito

### Fase 0 — Fundação
- Posicionamento, copy, dados fictícios removidos
- Estrutura do projeto limpa e escalável

### Auth
- Login, cadastro, esqueci senha, nova senha, callback
- Session management com Supabase SSR

### Header & Navegação
- `src/components/Header.tsx` — 100% client, reativo ao login
- Avatar com `<img>` nativo + `onError` fallback para inicial (evita problema de domínio no next/image)
- Badge de role: ⭐ Admin (dourado) / ⚡ Superadmin (roxo)
- Badge de notificações não lidas em realtime (Supabase Realtime)
- Dropdown com `useRef` fecha ao clicar fora
- Menu: Início, Louvor, Pregação, Crescimento, Testemunhos, 🔍 Explorar
- Links do usuário: Perfil, Histórico, Playlists, Meus Uploads, Configurações
- Admin vê: Painel de Curadoria
- Superadmin vê: Painel de Curadoria + ⚡ Gerenciar Usuários
- Mobile: hamburger com badge de notificações
- `proxy.ts`: proteção de rotas (Next.js 16)

### Banco de Dados
- 6 tabelas no Supabase + RLS + triggers
- Supabase admin client em `lib/supabase-admin.ts`
- Supabase server client em `lib/supabase-server.ts` com `createServerSupabase()`
- Tabela `notifications` criada com RLS ✅
- Tabela `admin_scopes` com RLS ✅
- Constraint `profiles_role_check` atualizada: `CHECK (role IN ('user', 'admin', 'superadmin'))`
- Triggers automáticos:
  - `notify_admins_on_upload()` — notifica admins com escopo compatível ao upload
  - `notify_creator_on_review()` — notifica criador quando aprovado/rejeitado

### Storage
- Bucket `avatars` criado no Supabase Storage (público) ✅
- Path: `avatars/{user_id}.{ext}`
- Policies: upload próprio, leitura pública, update próprio
- API Route: `POST /api/upload-avatar` — valida tipo e tamanho (max 2MB)

### Páginas
- `/perfil` — perfil do usuário com avatar dinâmico
- `/historico` — histórico de visualizações (CRUD completo)
- `/playlist` — playlists do usuário (CRUD completo + modal)
- `/configuracoes` — funcional: editar nome ✅, alterar senha ✅, upload de foto ✅, encerrar sessão ✅
- `/explorar` — todos os conteúdos com filtros avançados
- `/categoria/[slug]` — conteúdos por categoria
- `/meus-uploads` — usuário acompanha status dos próprios uploads (pending/approved/rejected) — dark theme ✅
- `/sobre` — página institucional placeholder ✅
- `/igrejas` — página B2B placeholder ✅
- `/criadores` — página para criadores placeholder ✅
- `/privacidade` — política de privacidade placeholder ✅
- `/suporte` — página de suporte placeholder ✅

### Player e Conteúdo
- `/content/[id]` — player nativo HTML5 com controles
- SEO dinâmico por conteúdo (title, og:image, twitter card)
- Sidebar com conteúdos relacionados (mesma categoria)

### Admin — Curadoria
- `/admin` — Painel de curadoria com filtros avançados
  - Abas: Pendentes, Aprovados, Rejeitados
  - Filtros: Busca por título, categoria, autor, ordenação
  - Ações: Aprovar, Rejeitar, Destacar, Remover
  - Contador dinâmico de itens por status
- `/admin/upload` — Upload para Cloudflare R2
  - Tipos: Vídeo, Áudio, Texto
  - Para Texto: não requer arquivo de mídia
  - Thumbnail opcional para vídeo/áudio
  - Upload com presigned URLs do R2
  - **Qualquer usuário logado pode submeter** — status inicial: `pending`
- `/admin/usuarios` — SuperAdmin only — dark theme ✅
  - Gerencia roles (user → admin → superadmin)
  - Define escopos por admin: categorias e criadores específicos
  - UI expandível por usuário com ScopePanel
  - Header + Footer incluídos ✅

### Sistema de Roles e Escopos
- `user` — acesso padrão, pode submeter conteúdo
- `admin` — modera conteúdos dentro do seu escopo (categorias + criadores)
- `superadmin` — acesso total, gerencia roles e escopos de admins
- Tabela `admin_scopes`: `(admin_id, scope_type, scope_value)` — scope_type: `category` | `creator`
- Lógica OR: admin acessa se bater categoria OU criador
- Admin sem escopo = não vê nada
- RLS em `contents` usa função `admin_can_access_content(admin_id, content_id)`

### Sistema de Notificações
- Tabela `notifications` com campos: `type`, `title`, `message`, `read`, `metadata`
- Types: `pending_content` | `content_approved` | `content_rejected`
- Badge realtime no Header via Supabase Realtime (canal `header-notifications`)
- Trigger SQL notifica automaticamente admins compatíveis ao upload
- Trigger SQL notifica criador ao ser aprovado/rejeitado
- `/notificacoes` — página a implementar

### API Routes
- `POST /api/upload-avatar` — upload de foto de perfil (Supabase Storage)
- `POST /api/admin/set-role` — altera role (superadmin only)
- `GET/POST/DELETE /api/admin/scopes` — gerencia escopos de admin (superadmin only)

### Home
- Dados reais do Supabase
- Título: "✨ Destaques da Semana"
- Link "Ver todos →" aponta para /explorar

### SEO Global
- `layout.tsx` com `metadataBase`, title template, openGraph, twitter
- `generateMetadata()` dinâmico em `/content/[id]` e `/categoria/[slug]`
- Canonical URLs em todas as páginas

### Páginas de Erro
- `/not-found.tsx` customizada com imagem, versículo e CTAs

### Busca e Exploração
- Página `/explorar` com filtros (tipo, categoria, ordenação)
- Campo de busca por título/descrição
- Busca global via Ctrl+K (modal) — componente `BuscaGlobal.tsx` existe mas ainda não integrado no Header
- Debounce 300ms para performance

---

## O que falta

### Prioritário
- `/notificacoes` — página de listagem e marcação como lida
- Player Plyr.js em `/content/[id]` (substituir `<video>` nativo)
- `<BuscaGlobal />` integrado no Header (Ctrl+K)

### Médio prazo
- Doações (Stripe / Mercado Pago)
- Comentários moderados
- Excluir conta (endpoint real)
- Alterar e-mail (endpoint real)

### Futuro
- B2B Igrejas (Fase 3) — salas exclusivas
- IA + Apps (Fase 4) — Whisper para transcrição

---

## Padrões do projeto

### Arquitetura
- Inline styles predominam (não Tailwind classes)
- Server Components por padrão
- `'use client'` só quando tem `useState`/`useEffect`
- Páginas com interação: `page.tsx` (server) + `NomeClient.tsx` (client)
- Header é 100% client (usa `supabase.auth.onAuthStateChange`)
- **Todas as páginas** devem ter `<Header />` e `<Footer />` no `page.tsx` server
- **Wrapper padrão**: `<div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>`

### Next.js 16
- `params` e `searchParams` são Promise — usar `await`
- Middleware virou `proxy.ts` — export `proxy()`
- `generateMetadata()` retorna `Promise<Metadata>`

### Supabase
- Browser: `createBrowserClient` / `supabase` de `lib/supabase.ts`
- Server: `createServerSupabase()` em `lib/supabase-server.ts`
- Admin: `supabaseAdmin` em `lib/supabase-admin.ts` (nunca em client)
- RLS em todas as tabelas
- Joins retornam **array** mesmo em relações `*-to-one` — SEMPRE usar `getCategory()` / `getCreatorName()`

### next.config.ts — domínios de imagem configurados
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.supabase.co' },
    { protocol: 'https', hostname: '**.supabase.in' },
  ],
}
```

### Typing
- TypeScript strict mode
- Types em `src/types/index.ts` — arquivo único consolidado
- **NUNCA** `item.category?.color` direto — usar `getCategory(item.category)?.color`

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── HomeClient.tsx
│   ├── api/
│   │   ├── upload-avatar/route.ts
│   │   └── admin/
│   │       ├── set-role/route.ts
│   │       └── scopes/route.ts
│   ├── content/[id]/
│   │   ├── page.tsx
│   │   └── ContentPlayer.tsx
│   ├── categoria/[slug]/
│   │   ├── page.tsx
│   │   └── CategoriaClient.tsx
│   ├── explorar/
│   ├── perfil/
│   ├── historico/
│   ├── playlist/
│   ├── configuracoes/
│   │   ├── page.tsx               ← Server: busca profile, passa props
│   │   └── ConfiguracoesClient.tsx ← Client: nome, senha, foto, sessão
│   ├── meus-uploads/
│   │   ├── page.tsx               ← Server: Header + Footer + dark bg
│   │   └── MeusUploadsClient.tsx
│   ├── sobre/page.tsx
│   ├── igrejas/page.tsx
│   ├── criadores/page.tsx
│   ├── privacidade/page.tsx
│   ├── suporte/page.tsx
│   ├── auth/
│   └── admin/
│       ├── page.tsx
│       ├── AdminClient.tsx
│       ├── upload/
│       └── usuarios/
│           ├── page.tsx               ← Server: Header + Footer + dark bg
│           └── UsuariosClient.tsx     ← Client: roles + escopos
├── components/
│   ├── Header.tsx                 ← 100% client
│   ├── Footer.tsx
│   ├── VideoCard.tsx
│   ├── ProfileAvatar.tsx
│   └── BuscaGlobal.tsx
├── hooks/
│   └── useBuscaGlobal.ts
├── lib/
│   ├── supabase.ts               ← browser client (exporta `supabase`)
│   ├── supabase-server.ts        ← createServerSupabase()
│   ├── supabase-admin.ts         ← supabaseAdmin (server only)
│   ├── cultua-config.ts
│   ├── r2.ts
│   ├── db.ts
│   └── proxy.ts
├── styles/
│   ├── globals.css
│   └── cultua.css
└── types/
    └── index.ts                  ← fonte única de tipos
```

---

## Types principais (`src/types/index.ts`)

```typescript
export type UserRole = 'user' | 'admin' | 'superadmin'

export type User = {
  id, email, full_name, avatar_url,
  role: UserRole,
  managed_categories: string[] | null,
  managed_creators: string[] | null,
  created_at, updated_at
}

export type Category = { id, name, slug, description, icon, color, created_at }

export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type ContentType   = 'video' | 'audio' | 'text'

export type Content = {
  // campos base...
  category?: Category | Category[] | null,  // ← join Supabase (sempre array)
  creator?: Pick<User, 'id'|'full_name'|'avatar_url'> | null
}

export type ContentWithStatus = {
  id, title, status, creator_id, created_at, url_thumb,
  category: Category | Category[] | null
}

export type Notification = {
  id, user_id, type: NotificationType,
  title, message, read, metadata, created_at
}

export type AdminScope    = { id, admin_id, scope_type: ScopeType, scope_value, granted_by, created_at }
export type AdminScopes   = { categories: string[], creators: string[] }
export type AdminWithScopes = { id, full_name, email, role, created_at, scopes: AdminScopes }

export type Profile = {
  id, full_name, avatar_url,
  role: UserRole,
  managed_categories: string[] | null,
  managed_creators: string[] | null,
  created_at
}

// ✅ HELPERS OBRIGATÓRIOS — usar sempre para acessar joins
export function getCategory(category): Category | null
export function getCategoryName(category): string
export function getCreatorName(creator): string
export function translateAuthError(message: string): string
```

---

## Proxy — proteção de rotas (`src/proxy.ts`)

```typescript
const PROTECTED_ROUTES = [
  '/perfil', '/playlist', '/historico', '/configuracoes',
  '/admin', '/meus-uploads'
]
const AUTH_ROUTES  = ['/auth/login', '/auth/signup']
const ROLE_ROUTES  = [{ path: '/admin/usuarios', role: 'superadmin' }]
```

---

## Migrations SQL — o que existe no banco

```sql
-- profiles: colunas extras
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'superadmin'));  -- ← constraint atualizada
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN managed_categories TEXT[];
ALTER TABLE profiles ADD COLUMN managed_creators UUID[];

-- notifications (com RLS)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pending_content','content_approved','content_rejected')),
  title TEXT NOT NULL, message TEXT, read BOOLEAN DEFAULT FALSE,
  metadata JSONB, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_scopes (com RLS + unique constraint)
CREATE TABLE admin_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('category','creator')),
  scope_value TEXT NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (admin_id, scope_type, scope_value)
);

-- Função de verificação de escopo
CREATE FUNCTION admin_can_access_content(p_admin_id UUID, p_content_id UUID) RETURNS BOOLEAN

-- Triggers
-- notify_admins_on_upload() → notifica admins com escopo compatível
-- notify_creator_on_review() → notifica criador ao ser aprovado/rejeitado
```

---

## Supabase Storage

```
Bucket: avatars (público)
Path:   avatars/{user_id}.{ext}
Policies:
  - INSERT: auth.uid()::text = foldername(name)[1]
  - SELECT: público
  - UPDATE: auth.uid()::text = foldername(name)[1]
```

---

## Variáveis de Ambiente (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

---

## URLs Importantes

| Recurso | URL |
|---|---|
| Produção | https://plataforma-crista.vercel.app |
| Repositório | https://github.com/hganaqui/cultua |
| Supabase | https://app.supabase.com |
| Cloudflare | https://dash.cloudflare.com |

---

## Branding CULTUA

- Cor primária: `#B8860B` (dourado escuro)
- Background: `#111111` (página) / `#1a1a1a` (card) / `#2a2a2a` (input/hover)
- Texto: `#FFFFFF` (título) / `#CCCCCC` (corpo) / `#666666` (secundário) / `#555555` (muted)
- Borders: `#2a2a2a` (card) / `#333333` (input) / `#444444` (select)
- Danger: `#EF4444` / Success: `#22C55E` / Info: `#60A5FA`
- Superadmin accent: `#A855F7` (roxo)
- Header border-bottom: `2px solid #B8860B`
- Border-radius: `8px` (btn) / `10px` (input) / `12px` (card) / `14px` (card grande) / `16px` (section)
- Fonte: system font-sans

---

## Padrões de Código

### Wrapper padrão de página (OBRIGATÓRIO)
```tsx
// page.tsx (server)
export default async function AlgumaPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <AlgumaClient ... />
      <Footer />
    </div>
  )
}
```

### Client Component
```tsx
'use client'
import { supabase } from '@/lib/supabase'

export default function AlgumaClient() {
  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#111111',
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* conteúdo */}
      </div>
    </main>
  )
}
```

### Acessar joins do Supabase (PADRÃO OBRIGATÓRIO)
```tsx
import { getCategory } from '@/types'

// ✅ CORRETO
const cat   = getCategory(item.category)
const color = cat?.color
const name  = cat?.name
const icon  = cat?.icon
const slug  = cat?.slug

// ❌ ERRADO — erro TS2339
const color = item.category?.color
```

### Configuracoes page pattern
```tsx
// page.tsx (server) → busca profile → passa { profile: Profile, email: string }
// ConfiguracoesClient.tsx (client) → recebe e usa as props
```

### Avatar sem next/image (evita erro de domínio)
```tsx
// Header usa <img> nativo com onError fallback:
<img
  src={avatarUrl}
  onError={() => setImgError(true)}
  style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
/>
```

---

## Roadmap

### Sprint Atual
- [ ] `/notificacoes` — página de notificações (listar + marcar como lida)
- [ ] Player Plyr.js em `/content/[id]` (substituir `<video>` nativo)
- [ ] `<BuscaGlobal />` integrado no Header (Ctrl+K)

### Q2 — Médio Prazo
- [ ] Doações (Stripe / Mercado Pago)
- [ ] Comentários moderados com aprovação
- [ ] Notificações por e-mail
- [ ] Excluir conta (endpoint real)
- [ ] Alterar e-mail

### Q3 — B2B Igrejas
- [ ] Salas exclusivas por igreja
- [ ] Modelo de assinatura recorrente
- [ ] Break-even previsto: mês 9-10

### Q4 — IA + Apps
- [ ] Transcrição automática (Whisper/Python)
- [ ] App nativo
- [ ] Busca semântica por conteúdo

---

## Commits Recentes

- Fix constraint: profiles_role_check atualizada para incluir 'superadmin'
- Fix build: getCategory exportada em types/index.ts
- Fix build: categoria/[slug]/page.tsx passava prop errada (slug vs contentId)
- Fix imagens: next.config.ts com remotePatterns para *.supabase.co
- Fix avatar: <img> nativo com onError no Header (evita 400 do next/image)
- Bucket avatars criado no Supabase Storage com policies
- Tabela notifications criada com RLS e índices
- Dark theme: meus-uploads e admin/usuarios corrigidos
- Header + Footer adicionados em todas as pages server
- Páginas placeholder: /sobre, /igrejas, /criadores, /privacidade, /suporte
- Sistema de roles e escopos: user/admin/superadmin
- API routes: set-role, scopes (GET/POST/DELETE), upload-avatar
- Notificações realtime no Header
- Configurações funcionais: nome, senha, foto, sessão
