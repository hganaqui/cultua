// src/app/historico/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HistoricoClient from './HistoricoClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Histórico' }

export default function HistoricoPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <HistoricoClient />
      <Footer />
    </div>
  )
}