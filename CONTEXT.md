# CULTUA — Contexto para novo chat

## Repositório
https://github.com/hganaqui/cultua

## Produção
https://plataforma-crista.vercel.app

## Stack
Next.js 16.3.4 + TypeScript + Supabase + Cloudflare R2 + Vercel + Tailwind CSS

## O que já está feito

### Fase 0 — Fundação
- Posicionamento, copy, dados fictícios removidos
- Estrutura do projeto limpa e escalável

### Auth
- Login, cadastro, esqueci senha, nova senha, callback
- Session management com Supabase SSR

### Header & Navegação
- Reativo ao login, dropdown com role admin
- Menu com abas: Início, Louvor, Pregação, Crescimento, Testemunhos
- Proxy.ts: proteção de rotas (Next.js 16)

### Banco de Dados
- 6 tabelas no Supabase + RLS + triggers
- Supabase admin client em lib/supabase-admin.ts
- Supabase server client em lib/supabase-server.ts com createServerSupabase()

### Páginas
- /perfil — perfil do usuário com avatar dinâmico
- /historico — histórico de visualizações (CRUD completo)
- /playlist — playlists do usuário (CRUD completo + modal)
- /configuracoes — configurações de conta
- /explorar — todos os conteúdos com filtros avançados
- /categoria/[slug] — conteúdos por categoria

### Player e Conteúdo
- /content/[id] — player com sidebar de relacionados
- SEO dinâmico por conteúdo (title, og:image, twitter card)
- Sidebar com conteúdos relacionados (mesma categoria)

### Admin — Curadoria
- /admin — Painel de curadoria com filtros avançados
  - Abas: Pendentes, Aprovados, Rejeitados
  - Filtros: Busca por título, categoria, autor, ordenação
  - Ações: Aprovar, Rejeitar, Destacar, Remover
  - Contador dinâmico de itens por status
- /admin/upload — Upload para Cloudflare R2
  - Tipos: Vídeo, Áudio, Texto
  - Para Texto: não requer arquivo de mídia
  - Thumbnail opcional para vídeo/áudio
  - Upload com presigned URLs do R2

### Home
- Dados reais do Supabase
- Destaques + categorias + últimos adicionados

### SEO Global
- layout.tsx com metadataBase, title template, openGraph, twitter
- generateMetadata() dinâmico em /content/[id] e /categoria/[slug]
- Canonical URLs em todas as páginas
- Icons, manifest, favicon configurados

### Páginas de Erro
- /not-found.tsx customizada com imagem, versículo e CTAs

### Busca e Exploração
- Página /explorar com filtros (tipo, categoria, ordenação)
- Campo de busca por título/descrição
- Busca global via Ctrl+K (modal)
- Debounce 300ms para performance

### Avatar e Perfil
- Avatar dinâmico: mostra foto do usuário ou primeira letra do nome
- Fallback inteligente para primeiro caractere
- Componente ProfileAvatar reutilizável

## O que falta

### Prioritário
- Link /explorar integrado no Header
- Componente <BuscaGlobal /> integrado no Header
- Destravar Configurações (/configuracoes)
- Player de vídeo/áudio para /content/[id]

### Médio prazo
- Doações (Stripe / Mercado Pago)
- Comentários moderados
- Notificações do sistema

### Futuro
- B2B Igrejas (Fase 3)
- IA + Apps (Fase 4)

## Padrões do projeto

### Arquitetura
- Tailwind CSS para estilização
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
- Joins: usar (item.category as any)?.name para acessar relacionamentos

### Typing
- TypeScript strict mode
- Types em src/types/
- Union types para joins: { name: string }[] | { name: string } | null

## Estrutura de Pastas

src/ ├── app/ │ ├── layout.tsx │ ├── not-found.tsx │ ├── page.tsx │ ├── content/[id]/ │ ├── categoria/[slug]/ │ ├── explorar/ │ ├── perfil/ │ ├── historico/ │ ├── playlist/ │ ├── configuracoes/ │ ├── auth/ │ └── admin/ │ ├── AdminClient.tsx │ └── upload/ ├── components/ │ ├── Header.tsx │ ├── Footer.tsx │ ├── ProfileAvatar.tsx │ └── BuscaGlobal.tsx ├── hooks/ │ └── useBuscaGlobal.ts ├── lib/ │ ├── supabase.ts │ ├── supabase-server.ts │ ├── supabase-admin.ts │ ├── cultua-config.ts │ ├── r2.ts │ └── proxy.ts ├── styles/ │ ├── globals.css │ └── cultua.css ├── types/ │ └── index.ts └── utils/


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

- Curadoria: filtros avançados (busca, categoria, autor, ordenação)
- Curadoria: funcionalidade de remover conteúdo
- Avatar dinâmico: foto ou primeira letra do nome
- Upload: suporte a texto sem mídia
- Página 404 customizada com imagem e versículo
- SEO dinâmico em /content/[id] e /categoria/[slug]
- /explorar com filtros completos
- Busca global com Ctrl+K

## Padrões de Código

### Componentes Client
```tsx
'use client'

import { useState } from 'react'

export default function MyComponent() {
  const [state, setState] = useState('')
  
  return <div>...</div>
}
Server Components
tsx
Copy code
import { createServerSupabase } from '@/lib/supabase-server'

export default async function Page() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('table').select()
  
  return <div>...</div>
}
Acessar Relacionamentos
tsx
Copy code
// Para evitar erro de tipo, use 'as any'
const categoryName = (item.category as any)?.name
const authorName = (item.creator as any)?.full_name
Filtros e Ordenação
tsx
Copy code
// Busca
result = result.filter(c => c.title.toLowerCase().includes(term))

// Categoria
result = result.filter(c => (c.category as any)?.name === category)

// Ordenação
result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
Próximas Tasks (Roadmap)
Sprint Atual
Integrar <BuscaGlobal /> no Header
Link /explorar no Header
Destravar Configurações
Player de vídeo/áudio
Sprint Próxima
Doações (Stripe / Mercado Pago)
Comentários moderados com aprovação
Notificações (novas pregações, replies)
Notas de Desenvolvimento
Performance
Imagens com Next/Image (otimização automática)
Debounce 300ms na busca global
Server-side rendering para SEO
maybeSingle() no Supabase para queries que podem não retornar
useMemo para listas filtradas
Segurança
RLS em todas as tabelas
Admin routes protegidas com proxy.ts
Service Role Key nunca em client components
Auth via Supabase SSR (cookies seguros)
Validação de role admin/moderator em /admin
UX
Dark theme: bg-neutral-900, bg-neutral-950
Accent color: #f5a623 (dourado)
Responsivo com Tailwind breakpoints
Hover states em botões/links
Loading states com spinners/mensagens
Confirmações antes de ações destrutivas
Branding CULTUA
Cor primária: #f5a623 (dourado)
Background escuro: #111111, #1a1a1a, #1e1e1e, #222
Texto claro: #ffffff, #cccccc, #aaaaaa
Texto secundário: #555555, #666666
Fonte: Tailwind default (font-sans)
Tone: Espiritual, acolhedor, moderno