import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Suporte — CULTUA' }

export default function SuportePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🙋</div>
        <h1 style={{ color: DS.colors.text.dark, fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Suporte
        </h1>
        <p style={{ color: DS.colors.text.secondary, fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
          Encontrou algum problema ou tem uma dúvida? Estamos aqui para ajudar.
        </p>
        <div style={{
          backgroundColor: DS.colors.bg.secondary, 
          border: `1px solid ${DS.colors.neutral.light}`,
          borderRadius: DS.borderRadius.lg, 
          padding: '32px',
          transition: DS.transitions.base,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = DS.colors.primary.main
          e.currentTarget.style.backgroundColor = DS.colors.primary.main + '08'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = DS.colors.neutral.light
          e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
        }}
        >
          <p style={{ color: DS.colors.text.secondary, fontSize: '15px', marginBottom: '8px', margin: 0 }}>
            📧 Entre em contato
          </p>
          <a href="mailto:contato@cultua.app" style={{
            color: DS.colors.primary.main, 
            fontSize: '16px', 
            fontWeight: '700',
            textDecoration: 'none',
            transition: DS.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = DS.colors.primary.light
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = DS.colors.primary.main
          }}
          >
            contato@cultua.app
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}