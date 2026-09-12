// src/app/sobre/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Sobre — CULTUA' }

export default function SobrePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>✝️</div>
        <h1 style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Sobre o CULTUA
        </h1>
        <p style={{ color: '#666666', fontSize: '16px', lineHeight: 1.8, marginBottom: '12px' }}>
          Uma plataforma cristã dedicada com curadoria humana.
        </p>
        <p style={{ color: '#666666', fontSize: '16px', lineHeight: 1.8 }}>
          Pregações, louvores, devocionais e testemunhos — organizados em um só lugar,
          para que sua fé seja edificada sem distrações.
        </p>
      </main>
      <Footer />
    </div>
  )
}