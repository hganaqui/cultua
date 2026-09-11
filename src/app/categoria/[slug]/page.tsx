// src/app/categoria/[slug]/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'  // ← ADD
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoriaClient from './CategoriaClient'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabase()               // ← ADD

  const { data: categoria } = await supabase                  // ← ADD
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .maybeSingle()

  // Fallback hardcoded — mantém o que você já tinha
  const NAMES: Record<string, string> = {
    louvor:      'Louvor',
    pregacao:    'Pregação',
    crescimento: 'Crescimento',
    testemunhos: 'Testemunhos',
  }

  const name = categoria?.name ?? NAMES[slug] ?? 'Categoria'  // ← banco primeiro, fallback depois
  const desc =
    categoria?.description ??
    `Explore conteúdos de ${name} — curados para alimentar sua fé.`
  const url = `https://plataforma-crista.vercel.app/categoria/${slug}`

  return {
    title:       name,
    description: desc,                                         // ← ADD
    openGraph: {                                               // ← ADD
      title:       name,
      description: desc,
      url,
      siteName:    'CULTUA',
      locale:      'pt_BR',
      type:        'website',
    },
    twitter: {                                                 // ← ADD
      card:        'summary_large_image',
      title:       name,
      description: desc,
    },
    alternates: {                                              // ← ADD
      canonical: url,
    },
  }
}

// ─── Page (100% igual ao original) ───────────────────────────────────────────
export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <CategoriaClient slug={slug} />
      <Footer />
    </div>
  )
}