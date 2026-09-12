import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ExplorarClient from './ExplorarClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Explorar' }

export default function ExplorarPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <ExplorarClient />
      <Footer />
    </div>
  )
}