'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function Hero() {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${DS.colors.bg.primary} 0%, ${DS.colors.bg.secondary} 50%, ${DS.colors.bg.primary} 100%)`,
      padding: '60px 16px',
      textAlign: 'center',
    }}>
      <style>{`
        .hero-title { font-size: 64px; }
        .hero-subtitle { font-size: 24px; }
        .hero-desc { font-size: 16px; }
        .hero-buttons { flex-direction: row; }
        .hero-stats { gap: 48px; }

        @media (max-width: 768px) {
          .hero-title { font-size: 40px !important; }
          .hero-subtitle { font-size: 18px !important; }
          .hero-desc { font-size: 14px !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
          .hero-stats { gap: 24px !important; }
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: DS.colors.primary.main + '20',
          color: DS.colors.primary.accent,
          padding: '6px 16px',
          borderRadius: DS.borderRadius.full,
          fontSize: '13px',
          fontWeight: DS.typography.fontWeight.semibold,
          marginBottom: '24px',
          border: `1px solid ${DS.colors.primary.main}30`,
        }}>
          📖 Conteúdo cristão curado para edificar sua fé
        </div>

        <h1 className="hero-title" style={{
          fontWeight: DS.typography.fontWeight.extrabold,
          color: DS.colors.primary.main,
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: '-1px',
        }}>
          CULTUA
        </h1>

        <p className="hero-subtitle" style={{
          color: DS.colors.text.secondary,
          fontWeight: '400',
          marginBottom: '16px',
          lineHeight: 1.4,
        }}>
          Conteúdo para alimentar sua fé.
        </p>

        <p className="hero-desc" style={{
          color: DS.colors.text.secondary,
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Pregações, louvores, devocionais, estudos e testemunhos —
          organizados em um só lugar, para você encontrar o que realmente edifica.
        </p>

        <div className="hero-buttons" style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '48px',
        }}>
          <Link href="/auth/signup" style={{
            backgroundColor: DS.colors.primary.main,
            color: 'white',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: DS.borderRadius.lg,
            fontSize: '16px',
            fontWeight: DS.typography.fontWeight.bold,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
            transition: DS.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.light
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.main
          }}
          >
            Começar Gratuitamente
          </Link>

          <Link href="#conteudo" style={{
            backgroundColor: DS.colors.primary.accent,
            color: DS.colors.text.dark,
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: DS.borderRadius.lg,
            fontSize: '16px',
            fontWeight: DS.typography.fontWeight.semibold,
            border: `2px solid ${DS.colors.primary.accent}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
            transition: DS.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E8C895'
            e.currentTarget.style.borderColor = '#E8C895'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.accent
            e.currentTarget.style.borderColor = DS.colors.primary.accent
          }}
          >
            📖 Ver Conteúdo
          </Link>
        </div>

        <div className="hero-stats" style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { number: '100%', label: 'Curadoria Humana' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: DS.typography.fontWeight.extrabold,
                color: DS.colors.primary.main,
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '13px',
                color: DS.colors.text.secondary,
                fontWeight: DS.typography.fontWeight.medium,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}