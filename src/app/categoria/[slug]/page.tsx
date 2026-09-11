// src/app/categoria/[slug]/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoriaClient from './CategoriaClient'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const names: Record<string, string> = {
    louvor: 'Louvor', pregacao: 'Pregação',
    crescimento: 'Crescimento', testemunhos: 'Testemunhos',
  }
  return { title: names[slug] ?? 'Categoria' }
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <CategoriaClient slug={slug} />
      <Footer />
    </div>
  )
}