import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ExplorarClient from './ExplorarClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Explorar' }

export default function ExplorarPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <ExplorarClient />
      <Footer />
    </div>
  )
}