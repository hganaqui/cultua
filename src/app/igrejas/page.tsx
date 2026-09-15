import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Igrejas — CULTUA' }

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function IgrejasPage() {
  return (
    <main style={{
      maxWidth: '800px', margin: '0 auto',
      padding: '80px 16px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '24px' }}>⛪</div>

      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        color: DS.colors.text.primary,
        fontSize: '32px', fontWeight: DS.typography.fontWeight.bold,
        marginBottom: '16px',
      }}>
        CULTUA para Igrejas
      </h1>

      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: '16px', lineHeight: 1.8, marginBottom: '28px',
      }}>
        Em breve — salas exclusivas para sua comunidade com
        conteúdos privados para membros.
      </p>

      <span style={{
        display: 'inline-block',
        fontFamily: DS.typography.fontFamily.body,
        backgroundColor: `${DS.colors.primary.accent}15`,
        color: DS.colors.primary.accent,
        border: `1px solid ${DS.colors.primary.accent}40`,
        padding: '8px 20px',
        borderRadius: DS.borderRadius.full,
        fontSize: '14px',
        fontWeight: DS.typography.fontWeight.semibold,
      }}>
        🚀 Em breve — Q1 2027
      </span>
    </main>
  )
}