import { createServerSupabase } from '@/lib/supabase-server'
import CategoriaClient from './CategoriaClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

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
    title:       category?.name ? `${category.name} — CULTUA` : 'CULTUA',
    description: category?.description ?? 'Conteúdo cristão curado.',
  }
}

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <CategoriaClient slug={slug} />
    </div>
  )
}