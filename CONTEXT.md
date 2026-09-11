# CULTUA — Contexto para novo chat

## Repositório
https://github.com/hganaqui/cultua

## Produção
https://plataforma-crista.vercel.app

## Stack
Next.js 16.3.4 + TypeScript + Supabase + Cloudflare R2 + Vercel

## O que já está feito

### Fase 0 — Fundação
- Posicionamento, copy, dados fictícios removidos
- Estrutura do projeto limpa e escalável

### Auth
- Login, cadastro, esqueci senha, nova senha, callback
- Session management com Supabase SSR

### Header & Navegação
- Reativo ao login, dropdown com role admin
- Proxy.ts: proteção de rotas (Next.js 16)

### Banco de Dados
- 6 tabelas no Supabase + RLS + triggers
- Supabase admin client em `lib/supabase-admin.ts`
- Supabase server client em `lib/supabase-server.ts` com `createServerSupabase()`

### Páginas
- `/perfil` — perfil do usuário
- `/historico` — histórico de visualizações (CRUD completo)
- `/playlist` — playlists do usuário (CRUD completo + modal)
- `/configuracoes` — configurações de conta
- `/explorar` — todos os conteúdos com filtros avançados
- `/categoria/[slug]` — conteúdos por categoria

### Player e Conteúdo
- `/content/[id]` — player com sidebar de relacionados
- SEO dinâmico por conteúdo (title, og:image, twitter card)
- Sidebar com conteúdos relacionados (mesma categoria)

### Admin
- `/admin` — curadoria de conteúdos
- `/admin/upload` — upload para Cloudflare R2

### Home
- Dados reais do Supabase
- Destaques + categorias + últimos adicionados

### SEO Global
- `layout.tsx` com `metadataBase`, `title template`, `openGraph`, `twitter`
- `generateMetadata()` dinâmico em `/content/[id]` e `/categoria/[slug]`
- Canonical URLs em todas as páginas
- Icons, manifest, favicon configurados

### Páginas de Erro
- `/not-found.tsx` customizada com imagem, versículo e CTAs

### Busca e Exploração
- Página `/explorar` com filtros (tipo, categoria, ordenação)
- Campo de busca por título/descrição
- Busca global via Ctrl+K (modal)
- Debounce 300ms para performance

## O que falta

### Prioritário
- Link `/explorar` no Header
- Componente `<BuscaGlobal />` integrado no Header
- Página de resultados de busca

### Médio prazo
- Doações (Stripe / Mercado Pago)
- Comentários moderados
- Notificações do sistema

### Futuro
- B2B Igrejas (Fase 3)
- IA + Apps (Fase 4)

## Padrões do projeto

### Arquitetura
- Inline styles (sem Tailwind)
- Server Components por padrão
- 'use client' só quando tem useState/useEffect
- Páginas com interação: page.tsx (server) + NomeClient.tsx (client)

### Next.js 16
- params e searchParams são Promise — usar await
- Middleware virou proxy.ts — export proxy()
- generateMetadata() retorna Promise<Metadata>

### Supabase
- Browser: createBrowserClient do @supabase/ssr (em lib/supabase.ts)
- Server: createServerSupabase() em lib/supabase-server.ts
- Admin: supabaseAdmin em lib/supabase-admin.ts (nunca importar em client)
- RLS: Row Level Security em todas as tabelas

### Typing
- TypeScript strict mode
- Types em src/types/
- Union types para joins: { name: string }[] | { name: string } | null

## Estrutura de Pastas
src/ ├── app/ │ ├── layout.tsx │ ├── not-found.tsx │ ├── page.tsx │ ├── content/[id]/ │ ├── categoria/[slug]/ │ ├── explorar/ │ ├── perfil/ │ ├── historico/ │ ├── playlist/ │ ├── configuracoes/ │ ├── auth/ │ └── admin/ ├── components/ │ ├── Header.tsx │ ├── Footer.tsx │ └── BuscaGlobal.tsx ├── hooks/ │ └── useBuscaGlobal.ts ├── lib/ │ ├── supabase.ts │ ├── supabase-server.ts │ ├── supabase-admin.ts │ ├── cultua-config.ts │ └── proxy.ts ├── styles/ │ ├── globals.css │ └── cultua.css ├── types/ │ └── database.ts └── utils/


## URLs Importantes

| Recurso | URL |
|---|---|
| Produção | https://plataforma-crista.vercel.app |
| Repositório | https://github.com/hganaqui/cultua |
| Supabase | https://app.supabase.com |
| Cloudflare | https://dash.cloudflare.com |

## Variáveis de Ambiente (.env.local)

NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY= SUPABASE_SERVICE_ROLE_KEY= NEXT_PUBLIC_R2_BUCKET= R2_ACCESS_KEY_ID= R2_SECRET_ACCESS_KEY= STRIPE_SECRET_KEY= STRIPE_PUBLISHABLE_KEY=


## Commits Recentes

- SEO dinâmico em /content/[id] com generateMetadata()
- SEO dinâmico em /categoria/[slug] com generateMetadata()
- layout.tsx com metadataBase + title template + openGraph + twitter
- not-found.tsx customizada com imagem, versículo e CTAs
- createServerSupabase() exportada em supabase-server.ts
- /explorar com filtros (tipo, categoria, ordenação)
- Busca global com Ctrl+K + debounce 300ms

## Próximas Tasks

### Sprint Atual
- Link /explorar no Header
- Integrar <BuscaGlobal /> no Header
- Página de resultados de busca

### Sprint Próxima
- Doações (Stripe / Mercado Pago)
- Comentários moderados com aprovação
- Notificações (novas pregações, replies)

## Notas de Desenvolvimento

### Performance
- Imagens com Next/Image (otimização automática)
- Debounce 300ms na busca global
- Server-side rendering para SEO
- maybeSingle() no Supabase para queries que podem não retornar

### Segurança
- RLS em todas as tabelas
- Admin routes protegidas com proxy.ts
- Service Role Key nunca em client components
- Auth via Supabase SSR (cookies seguros)

### UX
- Dark theme: #111, #1a1a1a, #1e1e1e
- Accent color: #f5a623 (dourado)
- Responsivo com clamp() no CSS
- Hover states em botões/links

## Branding CULTUA

- Cor primária: #f5a623 (dourado)
- Background escuro: #111111, #1a1a1a, #1e1e1e
- Texto claro: #ffffff, #aaaaaa
- Fonte: System stack (inherit)
- Tone: Espiritual, acolhedor, moderno