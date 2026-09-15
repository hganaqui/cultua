'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function Hero() {
  return (
    <section style={{
      backgroundColor: DS.colors.bg.primary,
      position: 'relative',
      overflow: 'hidden',
      padding: '80px 16px 72px',
      textAlign: 'center',
    }}>
      <style>{`
        .hero-eyebrow  { font-size: 13px; }
        .hero-title    { font-size: 52px; }
        .hero-subtitle { font-size: 19px; }
        .hero-buttons  { flex-direction: row; }
        .hero-pillars  { display: flex; }

        @media (max-width: 768px) {
          .hero-title    { font-size: 32px !important; letter-spacing: -0.5px !important; }
          .hero-subtitle { font-size: 16px !important; }
          .hero-buttons  {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100%;
            max-width: 300px;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .hero-pillars  { display: none !important; }
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .h-a1 { animation: heroFadeUp 0.6s ease 0.10s both; }
        .h-a2 { animation: heroFadeUp 0.6s ease 0.25s both; }
        .h-a3 { animation: heroFadeUp 0.6s ease 0.40s both; }
        .h-a4 { animation: heroFadeUp 0.6s ease 0.55s both; }
        .h-a5 { animation: heroFadeUp 0.6s ease 0.70s both; }

        .hero-btn-primary {
          background-color: ${DS.colors.primary.main};
          color: #FFFFFF;
          border: 2px solid ${DS.colors.primary.main};
          transition: ${DS.transitions.base};
        }
        .hero-btn-primary:hover {
          background-color: ${DS.colors.primary.light};
          border-color: ${DS.colors.primary.light};
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 61, 46, 0.28);
        }

        .hero-btn-outline {
          background-color: transparent;
          color: ${DS.colors.primary.main};
          border: 2px solid ${DS.colors.primary.main};
          transition: ${DS.transitions.base};
        }
        .hero-btn-outline:hover {
          background-color: rgba(15, 61, 46, 0.06);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Padrão de pontos — sutil */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(212,163,115,0.09) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
      }} />

      {/* Gradiente radial suave */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(15,61,46,0.05) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Eyebrow */}
        <div className="hero-eyebrow h-a1" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(15, 61, 46, 0.07)',
          border: '1px solid rgba(15, 61, 46, 0.15)',
          borderRadius: DS.borderRadius.full,
          padding: '6px 18px',
          marginBottom: '28px',
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.medium,
          color: DS.colors.primary.main,
          letterSpacing: '0.4px',
          textTransform: 'uppercase' as const,
        }}>
          <span style={{ color: DS.colors.primary.accent }}>✦</span>
          Conteúdo para edificar sua fé
        </div>

        {/* Título */}
        <h1 className="hero-title h-a2" style={{
          fontFamily: DS.typography.fontFamily.heading,
          fontWeight: DS.typography.fontWeight.bold,
          color: DS.colors.primary.main,
          lineHeight: 1.1,
          letterSpacing: '-1.5px',
          marginBottom: '20px',
        }}>
          Mais do que vídeos,{' '}
          <span style={{
            color: DS.colors.primary.accent,
            display: 'block',
          }}>
            uma jornada de fé.
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle h-a3" style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontWeight: DS.typography.fontWeight.normal,
          lineHeight: 1.7,
          maxWidth: '520px',
          margin: '0 auto 40px',
        }}>
          Pregações, louvores, devocionais e testemunhos —
          organizados e curados para você.
        </p>

        {/* CTAs */}
        <div className="hero-buttons h-a4" style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '64px',
        }}>
          <Link
            href="/auth/signup"
            className="hero-btn-primary"
            style={{
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: DS.borderRadius.lg,
              fontSize: '15px',
              fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.semibold,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(15, 61, 46, 0.18)',
              cursor: 'pointer',
            }}
          >
            Começar Gratuitamente
          </Link>

          <Link
            href="/explorar"
            className="hero-btn-outline"
            style={{
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: DS.borderRadius.lg,
              fontSize: '15px',
              fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.semibold,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            Explorar →
          </Link>
        </div>

        {/* Pilares da marca — brand book */}
        <div className="hero-pillars h-a5" style={{
          justifyContent: 'center',
          gap: '0',
          flexWrap: 'wrap',
        }}>
          {[
            { icon: '🕊️', label: 'Tranquilidade' },
            { icon: '🛡️', label: 'Confiança'     },
            { icon: '✨',  label: 'Esperança'     },
            { icon: '🤝',  label: 'Pertencimento' },
            { icon: '🎯',  label: 'Propósito'     },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column' as const,
                alignItems: 'center',
                gap: '4px',
                padding: '0 20px',
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{
                  fontSize: '12px',
                  fontFamily: DS.typography.fontFamily.body,
                  fontWeight: DS.typography.fontWeight.medium,
                  color: DS.colors.text.secondary,
                  letterSpacing: '0.2px',
                }}>
                  {item.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{
                  width: '1px',
                  height: '28px',
                  backgroundColor: DS.colors.neutral.medium,
                }} />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}