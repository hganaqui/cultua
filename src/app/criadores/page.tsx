'use client'

import { DESIGN_SYSTEM } from '@/lib/design-system'
import Link from 'next/link'

const DS = DESIGN_SYSTEM

export default function CriadoresPage() {
  return (
    <main style={{ backgroundColor: DS.colors.bg.primary, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        backgroundColor: DS.colors.primary.main,
        color: '#FFFFFF',
        padding: '60px 16px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '42px',
            fontWeight: DS.typography.fontWeight.bold,
            marginBottom: '16px',
            color: DS.colors.primary.accent,
            letterSpacing: '-0.5px',
          }}>
            Seja um Criador
          </h1>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            fontSize: '18px',
            marginBottom: '24px',
            color: 'rgba(255,255,255,0.85)',
          }}>
            Compartilhe seu conteúdo cristão com nossa comunidade
          </p>
        </div>
      </section>

      {/* Cards */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '60px',
        }}>
          {[
            { icon: '📤', title: 'Upload Fácil',    description: 'Faça upload de seus vídeos, áudios e textos em segundos' },
            { icon: '🎯', title: 'Alcance',          description: 'Sua mensagem chega para milhares de cristãos' },
            { icon: '✅', title: 'Curadoria',        description: 'Nosso time revisa para garantir qualidade' },
            { icon: '💰', title: 'Monetização',      description: 'Ganhe com seu conteúdo cristão' },
          ].map(item => (
            <div
              key={item.title}
              style={{
                backgroundColor: DS.colors.bg.secondary,
                borderRadius: DS.borderRadius.xl,
                padding: '32px 24px',
                textAlign: 'center',
                border: `1px solid ${DS.colors.neutral.light}`,
                boxShadow: DS.shadows.sm,
                transition: DS.transitions.base,
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = DS.shadows.lg
                el.style.borderColor = DS.colors.primary.main
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = DS.shadows.sm
                el.style.borderColor = DS.colors.neutral.light
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '20px',
                fontWeight: DS.typography.fontWeight.bold,
                color: DS.colors.text.primary,
                marginBottom: '12px',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: DS.typography.fontFamily.body,
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
          backgroundColor: `${DS.colors.primary.accent}12`,
          borderRadius: DS.borderRadius.xl,
          border: `2px solid ${DS.colors.primary.accent}50`,
        }}>
          <h2 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '28px',
            fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.primary,
            marginBottom: '16px',
          }}>
            Pronto para começar?
          </h2>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
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
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: DS.borderRadius.lg,
              textDecoration: 'none',
              fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.semibold,
              fontSize: '15px',
              boxShadow: '0 4px 16px rgba(15,61,46,0.2)',
              transition: DS.transitions.fast,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
}