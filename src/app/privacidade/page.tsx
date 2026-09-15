import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Privacidade — CULTUA' }

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function PrivacidadePage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px' }}>
      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        color: DS.colors.text.primary,
        fontSize: '28px', fontWeight: DS.typography.fontWeight.bold,
        marginBottom: '24px',
      }}>
        🔒 Política de Privacidade
      </h1>

      {[
        { title: 'Dados coletados',  text: 'Coletamos apenas e-mail e nome para criar sua conta. Não vendemos dados a terceiros.' },
        { title: 'Cookies',          text: 'Usamos cookies apenas para manter sua sessão ativa de forma segura.' },
        { title: 'Conteúdo',         text: 'Todo conteúdo passa por curadoria humana antes de ser publicado.' },
        { title: 'Contato',          text: 'Para dúvidas sobre privacidade, entre em contato pelo e-mail da plataforma.' },
      ].map(item => (
        <div
          key={item.title}
          style={{
            backgroundColor: DS.colors.bg.secondary,
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.lg, padding: '20px', marginBottom: '12px',
            boxShadow: DS.shadows.sm,
          }}
        >
          <h2 style={{
            fontFamily: DS.typography.fontFamily.heading,
            color: DS.colors.primary.main, fontSize: '15px',
            fontWeight: DS.typography.fontWeight.semibold, marginBottom: '8px',
          }}>
            {item.title}
          </h2>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary, fontSize: '14px',
            lineHeight: 1.7, margin: 0,
          }}>
            {item.text}
          </p>
        </div>
      ))}
    </main>
  )
}