import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
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

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(184,134,11,0.2)',
          color: '#D4AF37',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '24px',
          border: '1px solid rgba(184,134,11,0.3)',
        }}>
          ✨ 100% Sem Interrupções
        </div>

        {/* Título */}
        <h1 className="hero-title" style={{
          fontWeight: '900',
          color: '#B8860B',
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: '-1px',
        }}>
          CULTUA
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle" style={{
          color: '#CCCCCC',
          fontWeight: '400',
          marginBottom: '16px',
          lineHeight: 1.4,
        }}>
          Celebre sua fé sem distrações
        </p>

        {/* Descrição */}
        <p className="hero-desc" style={{
          color: '#999999',
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Pregações, louvores, devocionais e comunidade cristã em um único lugar.
          Sem interrupções. Nunca. Conteúdo curado para edificar sua fé.
        </p>

        {/* Botões */}
        <div className="hero-buttons" style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '48px',
        }}>
          <Link href="/auth/signup" style={{
            backgroundColor: '#B8860B',
            color: 'white',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
          }}>
            🎵 Começar Gratuitamente
          </Link>

          <Link href="#conteudo" style={{
            backgroundColor: 'transparent',
            color: '#CCCCCC',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            border: '2px solid #444444',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
          }}>
            📖 Ver Conteúdo
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { number: '500+', label: 'Vídeos e Áudios' },
            { number: '0', label: 'Interrupções' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                color: '#B8860B',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666666',
                fontWeight: '500',
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