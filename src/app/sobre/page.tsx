import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Sobre — CULTUA' }

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function SobrePage() {
  return (
    <main style={{
      maxWidth: '800px', margin: '0 auto',
      padding: '80px 16px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '24px' }}>✝️</div>

      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        color: DS.colors.text.primary,
        fontSize: '32px', fontWeight: DS.typography.fontWeight.bold,
        marginBottom: '16px',
      }}>
        Sobre o CULTUA
      </h1>

      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary, fontSize: '16px',
        lineHeight: 1.8, marginBottom: '12px',
      }}>
        Uma plataforma cristã dedicada com curadoria humana.
      </p>

      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary, fontSize: '16px', lineHeight: 1.8,
      }}>
        Pregações, louvores, devocionais e testemunhos — organizados em um só lugar,
        para que sua fé seja edificada sem distrações.
      </p>
    </main>
  )
}