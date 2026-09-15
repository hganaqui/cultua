import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HistoricoClient from './HistoricoClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Histórico' }

export default function HistoricoPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <HistoricoClient />
      <Footer />
    </div>
  )
}