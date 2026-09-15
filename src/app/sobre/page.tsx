import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Sobre — CULTUA' }

export default function SobrePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>✝️</div>
        <h1 style={{ color: DS.colors.text.dark, fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Sobre o CULTUA
        </h1>
        <p style={{ color: DS.colors.text.secondary, fontSize: '16px', lineHeight: 1.8, marginBottom: '12px' }}>
          Uma plataforma cristã dedicada com curadoria humana.
        </p>
        <p style={{ color: DS.colors.text.secondary, fontSize: '16px', lineHeight: 1.8 }}>
          Pregações, louvores, devocionais e testemunhos — organizados em um só lugar,
          para que sua fé seja edificada sem distrações.
        </p>
      </main>
      <Footer />
    </div>
  )
}