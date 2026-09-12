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
- Avatar com `<img>` nativo + `onError` fallback para inicial (sem next/image — evita 400)
- Badge de role: ⭐ Admin (dourado) / ⚡ Superadmin (roxo)
- Badge de notificações não lidas em realtime (Supabase Realtime)
- Dropdown com `useRef` fecha ao clicar fora
- Menu: Início, Louvor, Pregação, Crescimento, Testemunhos, 🔍 Explorar
- Links do usuário: Perfil, Histórico, Playlists, Meus Uploads, Configurações
- Admin vê: 🛡️ Painel de Curadoria
- Superadmin vê: 🛡️ Painel de Curadoria + ⚡ Gerenciar Usuários
- Mobile: hamburger com badge de notificações
- `proxy.ts`: proteção de rotas (Next.js 16)

### Banco de Dados
- 6 tabelas no Supabase + RLS + triggers
- Supabase admin client em `lib/supabase-admin.ts`
- Supabase server client em `lib/supabase-server.ts` com `createServerSupabase()`
- Tabela `notifications` criada com RLS ✅
- Tabela `admin_scopes` com RLS ✅
- Constraint `profiles_role_check` atualizada: `CHECK (role IN ('user', 'admin', 'superadmin'))`
- Triggers:
  - `notify_admins_on_upload()` — notifica admins com escopo compatível ao upload
  - `notify_creator_on_review()` — notifica criador quando aprovado/rejeitado

### Storage — Supabase
- Bucket `avatars` criado (público) ✅
- Path correto: `{user_id}.{ext}` (sem subpasta — evita path duplicado)
- URL gerada manualmente: `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`
- Policies: leitura pública, upload/update para autenticados
- API Route: `POST /api/upload-avatar`
  - Valida tipo (image/*) e tamanho (max 2MB)
  - Remove arquivo anterior antes de subir novo
  - Salva `avatar_url` no profile

### Páginas

#### Públicas
- `/` — Home dark theme ✅
  - `page.tsx`: `backgroundColor: '#111111'`
  - `Hero.tsx`: dark gradient (`#1A1A1A` → `#2D2D2D`)
  - `CategorySection.tsx`: dark (`#111111`) + cards `#1a1a1a`
  - `HomeClient.tsx`: dark (`#111111`) + skeleton dark
- `/categoria/[slug]` — conteúdos por categoria
- `/content/[id]` — player HTML5 nativo + sidebar relacionados
- `/explorar` — filtros avançados por tipo, categoria, ordenação
- `/sobre`, `/igrejas`, `/criadores`, `/privacidade`, `/suporte` — placeholders ✅

#### Autenticadas
- `/perfil` — perfil do usuário com avatar dinâmico
- `/historico` — histórico de visualizações (CRUD completo)
- `/playlist` — playlists do usuário (CRUD completo + modal)
- `/configuracoes` — funcional ✅
  - Foto de perfil: `<img>` nativo com `onError`, cache bust `?t=Date.now()`
  - Editar nome completo
  - Alterar senha (mín. 6 chars)
  - Encerrar sessão
  - Zona de perigo (excluir conta — em breve)
- `/meus-uploads` — status dos uploads (pending/approved/rejected) dark ✅

#### Admin
- `/admin` — Painel de curadoria (Pendentes/Aprovados/Rejeitados + filtros)
- `/admin/upload` — Upload para R2 (qualquer usuário logado pode submeter)
- `/admin/usuarios` — SuperAdmin only, dark theme ✅
  - Gerencia roles (user/admin/superadmin)
  - Define escopos: categorias + criadores por admin

### Sistema de Roles e Escopos
- `user` — acesso padrão, pode submeter conteúdo
- `admin` — modera conteúdos do seu escopo (categorias OU criadores — lógica OR)
- `superadmin` — acesso total
- Admin sem escopo = não vê nada
- Tabela `admin_scopes`: `(admin_id, scope_type, scope_value)`
- `scope_type`: `'category'` | `'creator'`
- Função SQL: `admin_can_access_content(admin_id, content_id) RETURNS BOOLEAN`

### Sistema de Notificações
- Tabela `notifications`: `type`, `title`, `message`, `read`, `metadata`
- Types: `pending_content` | `content_approved` | `content_rejected`
- Badge realtime no Header (canal `header-notifications`)
- Triggers SQL automáticos
- `/notificacoes` — a implementar

### API Routes
- `POST /api/upload-avatar`
- `POST /api/admin/set-role` (superadmin only)
- `GET /api/admin/scopes?admin_id=xxx`
- `POST /api/admin/scopes`
- `DELETE /api/admin/scopes`

### SEO
- `layout.tsx` com `metadataBase`, title template, openGraph, twitter
- `generateMetadata()` dinâmico em `/content/[id]` e `/categoria/[slug]`

### Páginas de Erro
- `/not-found.tsx` customizada

---

## O que falta

### Prioritário
- `/notificacoes` — página listar + marcar como lida
- Player Plyr.js em `/content/[id]` (substituir `<video>` nativo)
- `<BuscaGlobal />` integrado no Header (Ctrl+K)

### Médio prazo
- Doações (Stripe / Mercado Pago)
- Comentários moderados
- Excluir conta (endpoint real)
- Alterar e-mail

### Futuro
- B2B Igrejas (Fase 3) — salas exclusivas, break-even mês 9-10
- IA + Apps (Fase 4) — Whisper transcrição, app nativo

---

## Padrões do projeto

### Regra de ouro — Dark Theme
```
Todas as páginas DEVEM ter fundo dark.
Nunca usar: white, #F5F5F5, #E0E0E0, #1A1A1A claro

Paleta obrigatória:
- Página:    backgroundColor: '#111111'
- Card:      backgroundColor: '#1a1a1a'
- Input:     backgroundColor: '#111111', border: '1px solid #333333'
- Hover:     backgroundColor: '#2a2a2a'
- Skeleton:  backgroundColor: '#2a2a2a'
- Título:    color: '#FFFFFF'
- Corpo:     color: '#CCCCCC'
- Muted:     color: '#555555' ou '#666666'
- Border:    #2a2a2a (card) / #333333 (input) / #444444 (select)
```

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

// AlgumaClient.tsx (client)
<main style={{
  minHeight: 'calc(100vh - 60px)',
  backgroundColor: '#111111',
  padding: '40px 16px',
}}>
  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
    {/* conteúdo */}
  </div>
</main>
```

### Arquitetura
- Server Components por padrão
- `'use client'` só quando tem `useState`/`useEffect`
- Header é 100% client (`supabase.auth.onAuthStateChange`)
- Inline styles predominam (não Tailwind classes)

### Next.js 16
- `params` e `searchParams` são Promise — usar `await`
- Middleware virou `proxy.ts` — export `proxy()`
- `generateMetadata()` retorna `Promise<Metadata>`

### Supabase
- Browser: `supabase` de `lib/supabase.ts`
- Server: `createServerSupabase()` de `lib/supabase-server.ts`
- Admin: `supabaseAdmin` de `lib/supabase-admin.ts` (nunca em client)
- Joins retornam **array** mesmo em `*-to-one` — SEMPRE usar `getCategory()`

### Imagens
- Avatar: `<img>` nativo com `onError` — NUNCA `next/image` para avatars do Supabase
- Thumbnails: `next/image` com `remotePatterns` configurado em `next.config.ts`
- `next.config.ts` deve ter: `{ protocol: 'https', hostname: '**.supabase.co' }`

### Typing — OBRIGATÓRIO
```tsx
import { getCategory, getCategoryName, getCreatorName } from '@/types'

// ✅ CORRETO
const cat   = getCategory(item.category)
const color = cat?.color
const name  = cat?.name

// ❌ ERRADO — TS2339
const color = item.category?.color
```

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx                      ← bg #111111
│   ├── HomeClient.tsx                ← bg #111111, skeleton dark
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
│   │   ├── page.tsx                  ← Server: busca profile, passa props
│   │   └── ConfiguracoesClient.tsx   ← Client: <img> nativo, sem next/image
│   ├── meus-uploads/
│   │   ├── page.tsx
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
│           ├── page.tsx
│           └── UsuariosClient.tsx
├── components/
│   ├── Header.tsx                    ← 100% client, <img> nativo para avatar
│   ├── Footer.tsx                    ← já dark (#1A1A1A) ✅
│   ├── Hero.tsx                      ← já dark (gradient #1A1A1A) ✅
│   ├── CategorySection.tsx           ← dark (#111111) + cards #1a1a1a ✅
│   ├── VideoCard.tsx
│   ├── ProfileAvatar.tsx
│   └── BuscaGlobal.tsx
├── hooks/
│   └── useBuscaGlobal.ts
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   ├── supabase-admin.ts
│   ├── cultua-config.ts
│   ├── r2.ts
│   ├── db.ts
│   └── proxy.ts
├── styles/
│   ├── globals.css
│   └── cultua.css
└── types/
    └── index.ts
```

---

## Types principais (`src/types/index.ts`)

```typescript
export type UserRole = 'user' | 'admin' | 'superadmin'

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  managed_categories: string[] | null
  managed_creators: string[] | null
  created_at: string
}

export type Category = { id, name, slug, description, icon, color, created_at }

export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type ContentType   = 'video' | 'audio' | 'text'

export type Content = {
  // campos base...
  category?: Category | Category[] | null   // join — sempre array no Supabase
  creator?: Pick<User, 'id'|'full_name'|'avatar_url'> | null
}

export type ContentWithStatus = {
  id, title, status, creator_id, created_at, url_thumb,
  category: Category | Category[] | null
}

export type Notification = {
  id, user_id,
  type: 'pending_content' | 'content_approved' | 'content_rejected',
  title, message, read, metadata, created_at
}

export type AdminScope      = { id, admin_id, scope_type, scope_value, granted_by, created_at }
export type AdminWithScopes = { id, full_name, email, role, created_at, scopes: { categories: string[], creators: string[] } }

// Helpers OBRIGATÓRIOS
export function getCategory(category): Category | null
export function getCategoryName(category): string
export function getCreatorName(creator): string
export function translateAuthError(message): string
```

---

## Proxy — `src/proxy.ts`

```typescript
const PROTECTED_ROUTES = [
  '/perfil', '/playlist', '/historico', '/configuracoes',
  '/admin', '/meus-uploads'
]
const AUTH_ROUTES  = ['/auth/login', '/auth/signup']
const ROLE_ROUTES  = [{ path: '/admin/usuarios', role: 'superadmin' }]
```

---

## Banco de dados — SQL importante

```sql
-- Constraint atualizada (rodar se der erro de role)
ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'admin', 'superadmin'));

-- Setar superadmin
UPDATE profiles SET role = 'superadmin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'seu@email.com');

-- Corrigir URL de avatar duplicada (avatars/avatars/)
UPDATE profiles
SET avatar_url = REPLACE(avatar_url, '/avatars/avatars/', '/avatars/')
WHERE avatar_url LIKE '%/avatars/avatars/%';

-- Limpar avatar inválido
UPDATE profiles SET avatar_url = NULL
WHERE id = 'uuid-do-usuario';
```

---

## Storage — path correto do avatar

```typescript
// ✅ CORRETO — sem subpasta
const path = `${user.id}.${ext}`
// URL: ${SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}.jpg

// ❌ ERRADO — gera path duplicado
const path = `avatars/${user.id}.${ext}`
// URL quebrada: .../public/avatars/avatars/uuid.jpg
```

---

## next.config.ts

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },
}
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

| Recurso    | URL |
|------------|-----|
| Produção   | https://plataforma-crista.vercel.app |
| Repositório | https://github.com/hganaqui/cultua |
| Supabase   | https://app.supabase.com |
| Cloudflare | https://dash.cloudflare.com |

---

## Branding CULTUA

| Token | Valor |
|-------|-------|
| Primária | `#B8860B` (dourado) |
| Página bg | `#111111` |
| Card bg | `#1a1a1a` |
| Hover/input | `#2a2a2a` |
| Border card | `#2a2a2a` |
| Border input | `#333333` |
| Border select | `#444444` |
| Texto título | `#FFFFFF` |
| Texto corpo | `#CCCCCC` |
| Texto muted | `#555555` / `#666666` |
| Danger | `#EF4444` |
| Success | `#22C55E` |
| Info | `#60A5FA` |
| Superadmin | `#A855F7` |
| Header border | `2px solid #B8860B` |

---

## Commits Recentes

- Home dark theme: page.tsx, CategorySection, HomeClient, Hero
- Fix avatar: <img> nativo com onError em Header e Configurações
- Fix avatar path: sem subpasta (evita avatars/avatars/ duplicado)
- Fix avatar URL: UPDATE SQL para corrigir URLs já salvas
- Fix constraint: profiles_role_check inclui 'superadmin'
- Fix build: getCategory exportada em types/index.ts
- Fix build: categoria/[slug]/page.tsx prop corrigida (slug vs contentId)
- next.config.ts: remotePatterns para *.supabase.co
- Bucket avatars criado com policies corretas
- Tabela notifications + admin_scopes criadas
- Dark theme: meus-uploads, admin/usuarios, configuracoes
- Páginas placeholder: /sobre, /igrejas, /criadores, /privacidade, /suporte
- Sistema de roles e escopos completo
- Notificações realtime no Header
- Configurações funcionais: nome, senha, foto, sessão

---

## Roadmap

### Sprint Atual
- [ ] `/notificacoes` — página (listar + marcar como lida)
- [ ] Player Plyr.js em `/content/[id]`
- [ ] `<BuscaGlobal />` no Header (Ctrl+K)

### Q2
- [ ] Doações (Stripe / Mercado Pago)
- [ ] Comentários moderados
- [ ] Excluir conta + alterar e-mail

### Q3 — B2B Igrejas
- [ ] Salas exclusivas
- [ ] Assinatura recorrente (break-even mês 9-10)

### Q4 — IA + Apps
- [ ] Whisper transcrição
- [ ] App nativo
- [ ] Busca semântica
