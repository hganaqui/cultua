// src/app/categoria/[slug]/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoriaClient from './CategoriaClient'   // ← import correto
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase  = await createServerSupabase()

  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  return {
    title: category?.name ? `${category.name} — CULTUA` : 'CULTUA',
    description: category?.description ?? 'Conteúdo cristão curado sem interrupções.',
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <CategoriaClient slug={slug} />   {/* ← prop correta */}
      <Footer />
    </div>
  )
}