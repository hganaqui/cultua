'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

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
          backgroundColor: DS.colors.bg.secondary,
          borderRadius: DS.borderRadius.lg,
          overflow: 'hidden',
          boxShadow: DS.shadows.sm,
          transition: DS.transitions.base,
          cursor: 'pointer',
          border: `1px solid ${DS.colors.neutral.light}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = DS.shadows.md
          ;(e.currentTarget as HTMLElement).style.borderColor = DS.colors.primary.main
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = DS.shadows.sm
          ;(e.currentTarget as HTMLElement).style.borderColor = DS.colors.neutral.light
        }}
      >
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: thumbnail ? 'transparent' : DS.colors.neutral.medium,
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

          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: DS.borderRadius.sm,
            fontSize: '12px',
            fontWeight: DS.typography.fontWeight.semibold,
          }}>
            {duration}
          </div>

          {isFeatured && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: DS.colors.primary.main,
              color: 'white',
              padding: '4px 10px',
              borderRadius: DS.borderRadius.full,
              fontSize: '11px',
              fontWeight: DS.typography.fontWeight.extrabold,
            }}>
              ✨ Destaque
            </div>
          )}
          {isNew && !isFeatured && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: DS.colors.secondary.success,
              color: 'white',
              padding: '4px 10px',
              borderRadius: DS.borderRadius.full,
              fontSize: '11px',
              fontWeight: DS.typography.fontWeight.extrabold,
            }}>
              Novo
            </div>
          )}

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            backgroundColor: DS.colors.primary.main + 'E6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            opacity: 0.8,
            transition: DS.transitions.base,
          }}>
            ▶
          </div>
        </div>

        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: DS.typography.fontWeight.semibold,
            color: categoryColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px',
          }}>
            {category}
          </span>

          <h3 style={{
            fontSize: '15px',
            fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.dark,
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
            color: DS.colors.text.secondary,
            fontWeight: DS.typography.fontWeight.medium,
            marginTop: 'auto',
          }}>
            {creator}
          </span>
        </div>
      </div>
    </Link>
  )
}