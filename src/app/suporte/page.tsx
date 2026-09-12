// src/app/suporte/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Suporte — CULTUA' }

export default function SuportePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🙋</div>
        <h1 style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Suporte
        </h1>
        <p style={{ color: '#666666', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
          Encontrou algum problema ou tem uma dúvida? Estamos aqui para ajudar.
        </p>
        <div style={{
          backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '16px', padding: '32px',
        }}>
          <p style={{ color: '#CCCCCC', fontSize: '15px', marginBottom: '8px' }}>
            📧 Entre em contato
          </p>
          <p style={{ color: '#B8860B', fontSize: '16px', fontWeight: '700' }}>
            contato@cultua.app
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}