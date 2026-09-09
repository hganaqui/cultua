'use client'

import Link from 'next/link'

interface VideoCardProps {
  id: string
  title: string
  creator: string
  category: string
  categoryColor: string
  duration: string
  isFeatured?: boolean // selecionado pela curadoria
  isNew?: boolean      // conteúdo recente
  thumbnail?: string
}

export default function VideoCard({
  id,
  title,
  creator,
  category,
  categoryColor,
  duration,
  isFeatured = false,
  isNew = false,
  thumbnail,
}: VideoCardProps) {
  return (
    <Link href={`/content/${id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
        }}
      >
        {/* Thumbnail */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: thumbnail ? 'transparent' : '#1A1A1A',
          backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {!thumbnail && (
            <div style={{ fontSize: '40px' }}>🎵</div>
          )}

          {/* Duration badge — dado real, sempre existe */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {duration}
          </div>

          {isFeatured && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '700',
            }}>
              ✨ Destaque
            </div>
          )}
          {isNew && !isFeatured && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '700',
            }}>
              Novo
            </div>
          )}

          {/* Play button */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(184,134,11,0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}>
            ▶
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: categoryColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {category}
          </span>

          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#1A1A1A',
            margin: '6px 0 8px',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {title}
          </h3>

          <span style={{
            fontSize: '13px',
            color: '#666666',
            fontWeight: '500',
          }}>
            {creator}
          </span>
        </div>
      </div>
    </Link>
  )
}