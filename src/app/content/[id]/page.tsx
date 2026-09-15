import { createServerSupabase } from '@/lib/supabase-server'
import ContentPlayer from './ContentPlayer'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id }     = await params
  const supabase   = await createServerSupabase()

  const { data } = await supabase
    .from('contents')
    .select('title, description, url_thumb, type, category:categories(name)')
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle()

  if (!data) return { title: 'Conteúdo não encontrado — CULTUA' }

  const title        = data.title as string
  const categoriaRaw = data.category as { name: string }[] | { name: string } | null
  const catName      = Array.isArray(categoriaRaw) ? categoriaRaw[0]?.name : categoriaRaw?.name
  const desc         = (data.description as string | null) ?? `Conteúdo${catName ? ` de ${catName}` : ''} — curado para alimentar sua fé.`
  const image        = (data.url_thumb as string | null) ?? '/og-default.jpg'
  const url          = `https://plataforma-crista.vercel.app/content/${id}`

  return {
    title,
    description: desc,
    openGraph: {
      title, description: desc, url,
      siteName: 'CULTUA', locale: 'pt_BR', type: 'video.other',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [image] },
    alternates: { canonical: url },
  }
}

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default async function ContentPage({ params }: Props) {
  const { id } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <ContentPlayer contentId={id} />
    </div>
  )
}