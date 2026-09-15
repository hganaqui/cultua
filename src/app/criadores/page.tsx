'use client'

import { DESIGN_SYSTEM } from '@/lib/design-system'
import Link from 'next/link'

const DS = DESIGN_SYSTEM

export default function CriadoresPage() {
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
            Seja um Criador
          </h1>
          <p style={{
            fontSize: '18px',
            marginBottom: '24px',
            opacity: 0.9,
          }}>
            Compartilhe seu conteúdo cristão com nossa comunidade
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '60px',
        }}>
          {[
            {
              icon: '📤',
              title: 'Upload Fácil',
              description: 'Faça upload de seus vídeos, áudios e textos em segundos',
            },
            {
              icon: '🎯',
              title: 'Alcance',
              description: 'Sua mensagem chega para milhares de cristãos',
            },
            {
              icon: '✅',
              title: 'Curadoria',
              description: 'Nosso time revisa para garantir qualidade',
            },
            {
              icon: '💰',
              title: 'Monetização',
              description: 'Ganhe com seu conteúdo cristão',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                backgroundColor: DS.colors.bg.secondary,
                borderRadius: DS.borderRadius.lg,
                padding: '32px 24px',
                textAlign: 'center',
                border: `1px solid ${DS.colors.neutral.light}`,
                cursor: 'pointer',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = DS.shadows.lg
                e.currentTarget.style.borderColor = DS.colors.primary.main
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = DS.shadows.sm
                e.currentTarget.style.borderColor = DS.colors.neutral.light
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: DS.typography.fontWeight.bold,
                color: DS.colors.text.dark,
                marginBottom: '12px',
              }}>
                {item.title}
              </h3>
              <p style={{
                color: DS.colors.text.secondary,
                fontSize: '15px',
                lineHeight: 1.6,
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: DS.colors.primary.accent + '15',
          borderRadius: DS.borderRadius.lg,
          border: `2px solid ${DS.colors.primary.accent}`,
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.dark,
            marginBottom: '16px',
          }}>
            Pronto para começar?
          </h2>
          <p style={{
            fontSize: '16px',
            color: DS.colors.text.secondary,
            marginBottom: '24px',
          }}>
            Junte-se a criadores que estão transformando vidas através de conteúdo cristão
          </p>
          <Link
            href="/auth/signup"
            style={{
              display: 'inline-block',
              backgroundColor: DS.colors.primary.main,
              color: 'white',
              padding: '14px 32px',
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
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
}