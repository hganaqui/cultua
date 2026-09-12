// src/app/igrejas/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Igrejas — CULTUA' }

export default function IgrejasPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>⛪</div>
        <h1 style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          CULTUA para Igrejas
        </h1>
        <p style={{ color: '#666666', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
          Em breve — salas exclusivas para sua comunidade com conteúdos privados para membros.
        </p>
        <span style={{
          display: 'inline-block', backgroundColor: 'rgba(184,134,11,0.1)',
          color: '#B8860B', border: '1px solid rgba(184,134,11,0.3)',
          padding: '8px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: '700',
        }}>
          🚀 Em breve — Q3 2026
        </span>
      </main>
      <Footer />
    </div>
  )
}