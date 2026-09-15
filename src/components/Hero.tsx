'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function Hero() {
  return (
    <section style={{
      background: `linear-gradient(135deg, rgba(30, 58, 46, 0.05) 0%, rgba(212, 175, 124, 0.05) 50%, rgba(30, 58, 46, 0.05) 100%), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23B8860B" opacity="0.1"/></pattern></defs><rect width="1200" height="600" fill="white"/><rect width="1200" height="600" fill="url(%23dots)"/></svg>')`,
      backgroundSize: 'cover, 40px 40px',
      backgroundPosition: 'center',
      padding: '80px 16px',
      textAlign: 'center',
    }}>
      <style>{`
        .hero-title { font-size: 64px; }
        .hero-buttons { flex-direction: row; }

        @media (max-width: 768px) {
          .hero-title { font-size: 40px !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h1 className="hero-title" style={{
          fontWeight: DS.typography.fontWeight.extrabold,
          color: DS.colors.primary.main,
          lineHeight: 1.1,
          marginBottom: '12px',
          letterSpacing: '-1px',
        }}>
          CULTUA
        </h1>

        <p style={{
          fontSize: '22px',
          color: DS.colors.text.secondary,
          fontWeight: '400',
          marginBottom: '32px',
          lineHeight: 1.4,
        }}>
          Pregações, louvores e mais — tudo em um só lugar
        </p>

        <div className="hero-buttons" style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '60px',
        }}>
          <Link href="/auth/signup" style={{
            backgroundColor: DS.colors.primary.main,
            color: 'white',
            textDecoration: 'none',
            padding: '14px 32px',
            borderRadius: DS.borderRadius.lg,
            fontSize: '16px',
            fontWeight: DS.typography.fontWeight.bold,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
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
            padding: '14px 32px',
            borderRadius: DS.borderRadius.lg,
            fontSize: '16px',
            fontWeight: DS.typography.fontWeight.semibold,
            border: `2px solid ${DS.colors.primary.accent}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
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
            Explorar
          </Link>
        </div>

        {/* Stats - Limpo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          flexWrap: 'wrap',
        }}>
        </div>
      </div>
    </section>
  )
}