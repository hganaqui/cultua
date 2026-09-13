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
          background-color: #F5F3F0;
          border-radius: 12px;
          padding: 0;
          border: 1px solid #E8E3DE;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1 / 1;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
          border-color: #B8860B;
        }
        .category-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '12px',
          }}>
            O que você quer explorar hoje?
          </h2>
          <p style={{ color: '#555555', fontSize: '16px' }}>
            Cada categoria curada para edificar e aproximar você de Deus
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.id}`}
              className="category-card"
            >
              <div className="category-card-content">
                <div style={{
                  fontSize: '48px',
                  marginBottom: '12px',
                }}>
                  {cat.icon}
                </div>

                <h3 style={{
                  fontSize: '18px', fontWeight: '700',
                  color: '#111111',
                  marginBottom: '8px',
                  margin: 0,
                }}>
                  {cat.name}
                </h3>

                <div style={{
                  width: '32px',
                  height: '3px',
                  backgroundColor: cat.color,
                  borderRadius: '2px',
                  marginTop: '12px',
                }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}