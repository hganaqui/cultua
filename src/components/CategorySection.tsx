// src/components/CategorySection.tsx
'use client'

import Link from 'next/link'

const categories = [
  {
    id: 'louvor',
    name: 'Louvor',
    icon: '🎵',
    description: 'Músicas de louvor e adoração',
    color: '#B8860B',
    bg: 'rgba(184,134,11,0.1)',
    count: '120+ vídeos',
  },
  {
    id: 'pregacao',
    name: 'Pregação',
    icon: '📖',
    description: 'Mensagens e ensinamentos bíblicos',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.1)',
    count: '200+ vídeos',
  },
  {
    id: 'crescimento',
    name: 'Crescimento',
    icon: '💪',
    description: 'Devocionais e estudos bíblicos',
    color: '#4CAF50',
    bg: 'rgba(76,175,80,0.1)',
    count: '90+ vídeos',
  },
  {
    id: 'comunidade',
    name: 'Comunidade',
    icon: '🤝',
    description: 'Testemunhos e histórias de fé',
    color: '#1A3A52',
    bg: 'rgba(26,58,82,0.1)',
    count: '60+ vídeos',
  },
]

export default function CategorySection() {
  return (
    <section style={{
      padding: '64px 16px',
      backgroundColor: '#F5F5F5',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1A1A1A',
            marginBottom: '12px',
          }}>
            Explore por Categoria
          </h2>
          <p style={{ color: '#666666', fontSize: '16px' }}>
            Encontre conteúdo que edifica e inspira
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
        }}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categoria/${cat.id}`} style={{
              textDecoration: 'none',
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px 24px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: `2px solid transparent`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = cat.color
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
            }}>

              {/* Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: cat.bg,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
              }}>
                {cat.icon}
              </div>

              {/* Name */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1A1A1A',
                marginBottom: '8px',
              }}>
                {cat.name}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: '#666666',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}>
                {cat.description}
              </p>

              {/* Count */}
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: cat.color,
                backgroundColor: cat.bg,
                padding: '4px 12px',
                borderRadius: '9999px',
              }}>
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}