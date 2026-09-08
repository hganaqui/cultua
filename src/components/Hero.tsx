// src/components/Hero.tsx
import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
      padding: '80px 16px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Efeito de fundo */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(184,134,11,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>

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
          ✨ 100% Sem Anúncios · Sempre Gratuito
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '64px',
          fontWeight: '900',
          color: '#B8860B',
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: '-1px',
        }}>
          CULTUA
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: '24px',
          color: '#CCCCCC',
          fontWeight: '400',
          marginBottom: '16px',
          lineHeight: 1.4,
        }}>
          Celebre sua fé sem distrações
        </p>

        {/* Descrição */}
        <p style={{
          fontSize: '16px',
          color: '#999999',
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Pregações, louvores, devocionais e comunidade cristã em um único lugar.
          Sem anúncios. Nunca. Conteúdo curado para edificar sua fé.
        </p>

        {/* Botões */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '64px',
        }}>
          <Link href="/auth/signup" style={{
            backgroundColor: '#B8860B',
            color: 'white',
            textDecoration: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            🎵 Começar Gratuitamente
          </Link>

          <Link href="#conteudo" style={{
            backgroundColor: 'transparent',
            color: '#CCCCCC',
            textDecoration: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            border: '2px solid #444444',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📖 Ver Conteúdo
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '48px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { number: '500+', label: 'Vídeos e Áudios' },
            { number: '0', label: 'Anúncios' },
            { number: '100%', label: 'Gratuito' },
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