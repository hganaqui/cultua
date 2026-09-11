// src/app/content/[id]/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentPlayer from './ContentPlayer'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

// ─── SEO dinâmico ────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data } = await supabase
    .from('contents')
    .select('title, description, thumbnail_url, type, categoria:categories(name)')
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle()

  if (!data) {
    return { title: 'Conteúdo não encontrado' }
  }

  const TYPE_LABEL: Record<string, string> = {
    pregacao:   'Pregação',
    louvor:     'Louvor',
    devocional: 'Devocional',
    estudo:     'Estudo',
    testemunho: 'Testemunho',
  }

  const title = data.title as string
  const tipo  = TYPE_LABEL[data.type as string] ?? 'Conteúdo'

  // ✅ Fix: Supabase retorna join como array — pegar o primeiro elemento
  const categoriaRaw = data.categoria as { name: string }[] | { name: string } | null
  const catName = Array.isArray(categoriaRaw)
    ? categoriaRaw[0]?.name
    : categoriaRaw?.name

  const desc  =
    (data.description as string | null) ??
    `${tipo}${catName ? ` de ${catName}` : ''} — curado para alimentar sua fé.`
  const image = (data.thumbnail_url as string | null) ?? '/og-default.jpg'
  const url   = `https://plataforma-crista.vercel.app/content/${id}`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url,
      siteName: 'CULTUA',
      locale:   'pt_BR',
      type:     'video.other',
      images:   [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description: desc,
      images:      [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ContentPage({ params }: Props) {
  const { id } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1A' }}>
      <Header />
      <ContentPlayer contentId={id} />
      <Footer />
    </div>
  )
}