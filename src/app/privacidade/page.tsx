import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Privacidade — CULTUA' }

export default function PrivacidadePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px' }}>
        <h1 style={{ color: DS.colors.text.dark, fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          🔒 Política de Privacidade
        </h1>
        {[
          { title: 'Dados coletados', text: 'Coletamos apenas e-mail e nome para criar sua conta. Não vendemos dados a terceiros.' },
          { title: 'Cookies', text: 'Usamos cookies apenas para manter sua sessão ativa de forma segura.' },
          { title: 'Conteúdo', text: 'Todo conteúdo passa por curadoria humana antes de ser publicado.' },
          { title: 'Contato', text: 'Para dúvidas sobre privacidade, entre em contato pelo e-mail da plataforma.' },
        ].map(item => (
          <div key={item.title} style={{
            backgroundColor: DS.colors.bg.secondary,
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.lg, 
            padding: '20px', 
            marginBottom: '12px',
          }}>
            <h2 style={{ color: DS.colors.primary.main, fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
              {item.title}
            </h2>
            <p style={{ color: DS.colors.text.secondary, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  )
}