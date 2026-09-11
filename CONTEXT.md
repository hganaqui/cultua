# CULTUA — Contexto para novo chat

## Repositório
https://github.com/hganaqui/cultua

## Produção
https://plataforma-crista.vercel.app

## Stack
Next.js 16.3.4 + TypeScript + Supabase + Cloudflare R2 + Vercel

## O que já está feito
- Fase 0: posicionamento, copy, dados fictícios removidos
- Auth: login, cadastro, esqueci senha, nova senha, callback
- Header: reativo ao login, dropdown com role admin
- Proxy.ts: proteção de rotas (Next.js 16)
- Banco: 6 tabelas no Supabase + RLS + triggers
- Páginas: /perfil, /historico, /playlist, /configuracoes
- Player: /content/[id] com sidebar de relacionados
- Categorias: /categoria/[slug]
- Admin: /admin (curadoria) + /admin/upload (R2)
- Home: dados reais do Supabase
- Histórico: CRUD completo
- Playlists: CRUD completo + modal

## O que falta
- Página /explorar (todos os conteúdos)
- Busca global
- SEO dinâmico por conteúdo
- Página 404 customizada
- Doações (Stripe/Mercado Pago)
- Comentários moderados
- B2B Igrejas (Fase 3)
- IA + Apps (Fase 4)

## Padrões do projeto
- Inline styles (sem Tailwind)
- Server Component por padrão
- 'use client' só quando tem useState/useEffect
- Páginas com interação = page.tsx (server) + NomeClient.tsx (client)
- Next.js 16: params e searchParams são Promise (usar await)
- Next.js 16: middleware.ts virou proxy.ts, export proxy()
- Supabase browser: createBrowserClient do @supabase/ssr
- Supabase server: createServerClient + cookies() em supabase-server.ts
- Admin separado em supabase-admin.ts (nunca importar em client)