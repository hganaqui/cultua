// src/app/privacidade/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Privacidade — CULTUA' }

export default function PrivacidadePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          🔒 Política de Privacidade
        </h1>
        {[
          { title: 'Dados coletados', text: 'Coletamos apenas e-mail e nome para criar sua conta. Não vendemos dados a terceiros.' },
          { title: 'Cookies', text: 'Usamos cookies apenas para manter sua sessão ativa de forma segura.' },
          { title: 'Conteúdo', text: 'Todo conteúdo passa por curadoria humana antes de ser publicado.' },
          { title: 'Contato', text: 'Para dúvidas sobre privacidade, entre em contato pelo e-mail da plataforma.' },
        ].map(item => (
          <div key={item.title} style={{
            backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '12px', padding: '20px', marginBottom: '12px',
          }}>
            <h2 style={{ color: '#B8860B', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
              {item.title}
            </h2>
            <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.7 }}>{item.text}</p>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  )
}