'use client'

import Link from 'next/link'

const categories = [
  {
    id: 'louvor',
    name: 'Louvor',
    icon: '🎵',
    description: 'Músicas de louvor e adoração',
    color: '#B8860B',
    bg: 'rgba(184,134,11,0.12)',
    count: 'Explorar',
  },
  {
    id: 'pregacao',
    name: 'Pregação',
    icon: '📖',
    description: 'Mensagens e ensinamentos bíblicos',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.12)',
    count: 'Explorar',
  },
  {
    id: 'crescimento',
    name: 'Crescimento',
    icon: '🌱',
    description: 'Devocionais e estudos bíblicos',
    color: '#4CAF50',
    bg: 'rgba(76,175,80,0.12)',
    count: 'Explorar',
  },
  {
    id: 'testemunhos',
    name: 'Testemunhos',
    icon: '🙏',
    description: 'Histórias reais de fé e transformação',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.12)',
    count: 'Explorar',
  },
]

export default function CategorySection() {
  return (
    // ✅ dark
    <section style={{ padding: '64px 16px', backgroundColor: '#111111' }}>
      <style>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .category-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .category-grid { grid-template-columns: 1fr !important; }
        }
        .category-card {
          text-decoration: none;
          background-color: #1a1a1a;
          border-radius: 16px;
          padding: 28px 20px;
          border: 1px solid #2a2a2a;
          transition: all 0.2s ease;
          display: block;
        }
        .category-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header da seção */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: '#FFFFFF',              // ✅ branco
            marginBottom: '12px',
          }}>
            O que você quer explorar hoje?
          </h2>
          <p style={{ color: '#555555', fontSize: '16px' }}>  {/* ✅ cinza escuro */}
            Cada categoria curada para edificar e aproximar você de Deus
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.id}`}
              className="category-card"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = cat.color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2a2a2a'
              }}
            >
              {/* Ícone */}
              <div style={{
                width: '52px', height: '52px',
                backgroundColor: cat.bg,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px', marginBottom: '14px',
              }}>
                {cat.icon}
              </div>

              {/* Nome */}
              <h3 style={{
                fontSize: '18px', fontWeight: '700',
                color: '#FFFFFF',          // ✅ branco
                marginBottom: '8px',
              }}>
                {cat.name}
              </h3>

              {/* Descrição */}
              <p style={{
                fontSize: '13px',
                color: '#555555',          // ✅ cinza escuro
                marginBottom: '14px',
                lineHeight: 1.5,
              }}>
                {cat.description}
              </p>

              {/* Badge */}
              <span style={{
                fontSize: '11px', fontWeight: '600',
                color: cat.color,
                backgroundColor: cat.bg,
                padding: '4px 12px',
                borderRadius: '9999px',
                border: `1px solid ${cat.color}33`,
              }}>
                {cat.count} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}