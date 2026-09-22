// ✅ 1️⃣ VideoCard.tsx
// Caminho: app/components/VideoCard.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import SeloCuradoria from '@/components/SeloCuradoria'
import TagBadge from '@/components/TagBadge'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface VideoCardProps {
  id: string
  title: string
  creator: string
  category: string
  categoryColor?: string
  duration: string
  isFeatured?: boolean
  isNew?: boolean
  isCurated?: boolean
  thumbnail?: string
  tags?: Tag[]
  type?: 'video' | 'audio' | 'text'
}

export default function VideoCard({
  id,
  title,
  creator,
  category,
  categoryColor = DS.colors.primary.accent,
  duration,
  isFeatured = false,
  isNew = false,
  isCurated = false,
  thumbnail,
  tags = [],
  type = 'video',
}: VideoCardProps) {
  const [hovered, setHovered] = useState(false)

  const typeEmoji = { video: '🎬', audio: '🎵', text: '📄' }[type] ?? '🎵'

  return (
    <Link href={`/content/${id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          backgroundColor: DS.colors.bg.secondary,
          borderRadius: DS.borderRadius.lg,
          overflow: 'hidden',
          boxShadow: hovered ? DS.shadows.lg : DS.shadows.sm,
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: DS.transitions.base,
          cursor: 'pointer',
          border: `1px solid ${hovered ? DS.colors.primary.main : DS.colors.neutral.light}`,
          display: 'flex',
          flexDirection: 'column' as const,
          height: '100%',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Thumbnail ── */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: DS.colors.neutral.light,
          flexShrink: 0,
        }}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: DS.transitions.slow,
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${DS.colors.primary.main}10`,
              fontSize: '36px',
            }}>
              {typeEmoji}
            </div>
          )}

          {/* Overlay escuro no hover */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
            opacity: hovered ? 1 : 0,
            transition: DS.transitions.base,
          }} />

          {/* Botão play — aparece no hover */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            backgroundColor: DS.colors.primary.main,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#FFFFFF',
            opacity: hovered ? 1 : 0,
            transition: DS.transitions.base,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}>
            ▶
          </div>

          {/* Duração */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.72)',
            color: '#FFFFFF',
            padding: '3px 8px',
            borderRadius: DS.borderRadius.sm,
            fontSize: '11px',
            fontFamily: DS.typography.fontFamily.body,
            fontWeight: DS.typography.fontWeight.semibold,
            letterSpacing: '0.3px',
          }}>
            {duration}
          </div>

          {/* Badge Destaque */}
          {isFeatured && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: DS.colors.primary.accent,
              color: DS.colors.primary.main,
              padding: '4px 10px',
              borderRadius: DS.borderRadius.full,
              fontSize: '10px',
              fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.bold,
              letterSpacing: '0.3px',
            }}>
              ✦ Destaque
            </div>
          )}

          {/* Badge Novo */}
          {isNew && !isFeatured && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: DS.colors.secondary.success,
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: DS.borderRadius.full,
              fontSize: '10px',
              fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.bold,
            }}>
              Novo
            </div>
          )}

          {/* Selo curadoria */}
          {isCurated && !isFeatured && !isNew && (
            <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
              <SeloCuradoria variant="compact" />
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div style={{
          padding: '14px 16px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '4px',
        }}>
          {/* Categoria */}
          <span style={{
            fontSize: '11px',
            fontFamily: DS.typography.fontFamily.body,
            fontWeight: DS.typography.fontWeight.semibold,
            color: categoryColor,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.6px',
          }}>
            {category}
          </span>

          {/* Título */}
          <h3 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '15px',
            fontWeight: DS.typography.fontWeight.bold,
            color: hovered ? DS.colors.primary.main : DS.colors.text.primary,
            margin: '2px 0 6px',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            transition: DS.transitions.fast,
          }}>
            {title}
          </h3>

          {/* Criador */}
          <span style={{
            fontSize: '13px',
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary,
            fontWeight: DS.typography.fontWeight.medium,
            marginTop: 'auto',
          }}>
            {creator}
          </span>

          {/* Tags */}
          {tags.length > 0 && (
            <TagBadge tags={tags} maxDisplay={2} />
          )}
        </div>
      </div>
    </Link>
  )
}