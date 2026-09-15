'use client'

import { DESIGN_SYSTEM } from '@/lib/design-system'
import { useState } from 'react'

const DS = DESIGN_SYSTEM

const FAQS = [
  {
    id: 'upload',
    question: 'Como fazer upload de conteúdo?',
    answer: 'Acesse sua conta, vá em "Meus Uploads" e clique em "Novo Upload". Escolha o tipo de conteúdo e complete o formulário com informações sobre seu vídeo, áudio ou texto.',
  },
  {
    id: 'aprovacao',
    question: 'Quanto tempo leva para meu conteúdo ser aprovado?',
    answer: 'Nosso time de curadoria revisa todos os uploads em até 48 horas. Você receberá uma notificação quando seu conteúdo for aprovado ou se precisar fazer ajustes.',
  },
  {
    id: 'conta',
    question: 'Como posso criar uma conta?',
    answer: 'Clique em "Começar" no topo da página, preencha seu e-mail, nome e senha. Confirme seu e-mail no link que enviamos.',
  },
  {
    id: 'categorias',
    question: 'Quais categorias posso enviar?',
    answer: 'Aceitamos conteúdo em: Louvor, Pregação, Crescimento Espiritual e Testemunhos. Certifique-se que seu conteúdo está alinhado com valores cristãos.',
  },
  {
    id: 'contato',
    question: 'Como entrar em contato com o suporte?',
    answer: 'Envie um e-mail para suporte@cultua.com ou use o formulário de contato abaixo. Respondemos em até 24 horas.',
  },
]

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function SuportePage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  return (
    <main style={{ backgroundColor: DS.colors.bg.primary, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        backgroundColor: DS.colors.primary.main,
        color: '#FFFFFF', padding: '60px 16px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '42px', fontWeight: DS.typography.fontWeight.bold,
            marginBottom: '16px', color: DS.colors.primary.accent,
            letterSpacing: '-0.5px',
          }}>
            Central de Suporte
          </h1>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            fontSize: '18px', color: 'rgba(255,255,255,0.85)',
            marginBottom: '24px',
          }}>
            Encontre respostas para suas dúvidas sobre CULTUA
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px' }}>
        <h2 style={{
          fontFamily: DS.typography.fontFamily.heading,
          fontSize: '28px', fontWeight: DS.typography.fontWeight.bold,
          color: DS.colors.text.primary,
          marginBottom: '40px', textAlign: 'center',
        }}>
          Perguntas Frequentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {FAQS.map(faq => (
            <div
              key={faq.id}
              style={{
                backgroundColor: DS.colors.bg.secondary,
                border: `1px solid ${DS.colors.neutral.light}`,
                borderRadius: DS.borderRadius.lg, overflow: 'hidden',
                boxShadow: DS.shadows.sm,
              }}
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                style={{
                  width: '100%', padding: '20px',
                  backgroundColor: DS.colors.bg.secondary,
                  border: 'none', textAlign: 'left' as const,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: DS.transitions.fast,
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '16px', fontWeight: DS.typography.fontWeight.semibold,
                  color: DS.colors.text.primary,
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${DS.colors.primary.accent}15`)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.bg.secondary)}
              >
                {faq.question}
                <span style={{
                  fontSize: '18px', flexShrink: 0, marginLeft: '12px',
                  transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  color: DS.colors.text.muted,
                }}>
                  ▾
                </span>
              </button>

              {openFAQ === faq.id && (
                <div style={{
                  padding: '20px',
                  backgroundColor: `${DS.colors.primary.accent}08`,
                  borderTop: `1px solid ${DS.colors.neutral.light}`,
                  fontFamily: DS.typography.fontFamily.body,
                  color: DS.colors.text.secondary,
                  lineHeight: 1.7, fontSize: '15px',
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Contato */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px 80px' }}>
        <div style={{
          backgroundColor: `${DS.colors.primary.accent}12`,
          borderRadius: DS.borderRadius.xl,
          border: `2px solid ${DS.colors.primary.accent}50`,
          padding: '40px', textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '24px', fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.primary, marginBottom: '12px',
          }}>
            Não encontrou sua resposta?
          </h2>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary, fontSize: '15px',
            marginBottom: '24px', lineHeight: 1.7,
          }}>
            Estamos aqui para ajudar! Entre em contato com nossa equipe de suporte.
          </p>
          <a
            href="mailto:suporte@cultua.com"
            style={{
              display: 'inline-block',
              backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
              padding: '12px 28px', borderRadius: DS.borderRadius.lg,
              textDecoration: 'none', fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.semibold,
              fontSize: '15px', transition: DS.transitions.fast,
              boxShadow: '0 4px 16px rgba(15,61,46,0.2)',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
          >
            📧 Enviar E-mail
          </a>
        </div>
      </section>
    </main>
  )
}