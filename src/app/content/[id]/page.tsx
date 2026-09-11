// src/app/content/[id]/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentPlayer from './ContentPlayer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Assistir' }

export default async function ContentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1A' }}>
      <Header />
      <ContentPlayer contentId={id} />
      <Footer />
    </div>
  )
}