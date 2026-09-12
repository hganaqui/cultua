// src/app/criadores/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Criadores — CULTUA' }

export default function CriadoresPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🎙️</div>
        <h1 style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Para Criadores
        </h1>
        <p style={{ color: '#666666', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
          Compartilhe pregações, louvores e testemunhos com a comunidade cristã.
          Seu conteúdo passa por curadoria antes de ser publicado.
        </p>
        <a href="/admin/upload" style={{
          display: 'inline-block', backgroundColor: '#B8860B', color: 'white',
          textDecoration: 'none', padding: '12px 28px', borderRadius: '10px',
          fontSize: '15px', fontWeight: '700',
        }}>
          Enviar conteúdo →
        </a>
      </main>
      <Footer />
    </div>
  )
}