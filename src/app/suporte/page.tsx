'use client'

import { DESIGN_SYSTEM } from '@/lib/design-system'
import Link from 'next/link'
import { useState } from 'react'

const DS = DESIGN_SYSTEM

export default function SuportePage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqs = [
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

  return (
    <main style={{ backgroundColor: DS.colors.bg.primary, minHeight: '100vh', paddingTop: '60px' }}>
      
      {/* Hero Section */}
      <section style={{
        backgroundColor: DS.colors.primary.main,
        color: 'white',
        padding: '60px 16px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: DS.typography.fontWeight.extrabold,
            marginBottom: '16px',
            color: DS.colors.primary.accent,
          }}>
            Central de Suporte
          </h1>
          <p style={{
            fontSize: '18px',
            marginBottom: '24px',
            opacity: 0.9,
          }}>
            Encontre respostas para suas dúvidas sobre CULTUA
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 16px',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: DS.typography.fontWeight.bold,
          color: DS.colors.text.dark,
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          Perguntas Frequentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              style={{
                backgroundColor: DS.colors.bg.secondary,
                border: `1px solid ${DS.colors.neutral.light}`,
                borderRadius: DS.borderRadius.lg,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: DS.colors.bg.secondary,
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: DS.transitions.base,
                  fontSize: '16px',
                  fontWeight: DS.typography.fontWeight.semibold,
                  color: DS.colors.text.dark,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = DS.colors.primary.accent + '15'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                }}
              >
                {faq.question}
                <span style={{
                  fontSize: '20px',
                  transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}>
                  ▼
                </span>
              </button>

              {openFAQ === faq.id && (
                <div style={{
                  padding: '20px',
                  backgroundColor: DS.colors.primary.accent + '08',
                  borderTop: `1px solid ${DS.colors.neutral.light}`,
                  color: DS.colors.text.secondary,
                  lineHeight: 1.7,
                  fontSize: '15px',
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '60px 16px',
      }}>
        <div style={{
          backgroundColor: DS.colors.primary.accent + '15',
          borderRadius: DS.borderRadius.lg,
          border: `2px solid ${DS.colors.primary.accent}`,
          padding: '40px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.dark,
            marginBottom: '12px',
          }}>
            Não encontrou sua resposta?
          </h2>
          <p style={{
            color: DS.colors.text.secondary,
            fontSize: '15px',
            marginBottom: '24px',
            lineHeight: 1.7,
          }}>
            Estamos aqui para ajudar! Entre em contato com nossa equipe de suporte.
          </p>
          <a
            href="mailto:suporte@cultua.com"
            style={{
              display: 'inline-block',
              backgroundColor: DS.colors.primary.main,
              color: 'white',
              padding: '12px 28px',
              borderRadius: DS.borderRadius.md,
              textDecoration: 'none',
              fontWeight: DS.typography.fontWeight.bold,
              transition: DS.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = DS.colors.primary.light
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = DS.colors.primary.main
            }}
          >
            📧 Enviar E-mail
          </a>
        </div>
      </section>
    </main>
  )
}