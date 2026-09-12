'use client'

import Link from 'next/link'

interface VideoCardProps {
  id: string
  title: string
  creator: string
  category: string
  categoryColor: string
  duration: string
  isFeatured?: boolean
  isNew?: boolean
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
          backgroundColor: '#FFFFFF', /* ✅ MUDOU: branco */
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: '1px solid #E0E0E0', /* ✅ NOVO: borda cinza claro */
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        {/* Thumbnail */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: thumbnail ? 'transparent' : '#F0F0F0', /* ✅ MUDOU: cinza claro */
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

          {/* Duration badge */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
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
              padding: '4px 10px',
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
              padding: '4px 10px',
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
            opacity: 0.8,
            transition: 'opacity 0.3s',
          }}>
            ▶
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: categoryColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px',
          }}>
            {category}
          </span>

          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#111111', /* ✅ MUDOU: texto escuro */
            margin: '0 0 8px 0',
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
            color: '#666666', /* ✅ MUDOU: cinza */
            fontWeight: '500',
            marginTop: 'auto',
          }}>
            {creator}
          </span>
        </div>
      </div>
    </Link>
  )
}