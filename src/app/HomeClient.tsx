'use client'

import Link from 'next/link'
import VideoCard from '@/components/VideoCard'
import { useEffect, useState } from 'react'
import { getFeaturedContents } from '@/lib/db'
import type { Content } from '@/types'
import { getCategory } from '@/types'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function HomeClient() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getFeaturedContents(6).then(({ data }) => {
      setContents(data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <section id="conteudo" style={{ padding: '64px 16px', backgroundColor: DS.colors.bg.primary }}>
      <style>{`
        .video-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media (max-width: 1024px) { .video-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px)  { .video-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header da seção */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px',
          flexWrap: 'wrap' as const, gap: '16px',
        }}>
          <div>
            <h2 style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: '26px', fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.text.primary, marginBottom: '4px',
            }}>
              ✨ Destaques da Semana
            </h2>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '14px' }}>
              Escolhidos pela nossa equipe para edificar você
            </p>
          </div>
          <Link
            href="/explorar"
            style={{
              fontFamily: DS.typography.fontFamily.body,
              color: DS.colors.primary.main,
              textDecoration: 'none', fontSize: '14px',
              fontWeight: DS.typography.fontWeight.semibold,
              border: `1px solid ${DS.colors.primary.main}40`,
              padding: '8px 16px', borderRadius: DS.borderRadius.lg,
              transition: DS.transitions.fast,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${DS.colors.primary.main}10`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Ver todos →
          </Link>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="video-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                backgroundColor: DS.colors.bg.secondary,
                border: `1px solid ${DS.colors.neutral.light}`,
                borderRadius: DS.borderRadius.lg, overflow: 'hidden',
                animation: 'pulse 1.5s infinite',
              }}>
                <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: DS.colors.neutral.medium }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '16px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, marginBottom: '8px' }} />
                  <div style={{ height: '12px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>

        ) : contents.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px',
            backgroundColor: DS.colors.bg.secondary,
            borderRadius: DS.borderRadius.xl,
            border: `1px solid ${DS.colors.neutral.light}`,
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '15px' }}>
              Conteúdos chegando em breve. Volte logo!
            </p>
          </div>

        ) : (
          <div className="video-grid">
            {contents.map(item => {
              const cat = getCategory(item.category)
              return (
                <VideoCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  creator={item.creator?.full_name ?? 'CULTUA'}
                  category={cat?.name ?? ''}
                  categoryColor={cat?.color ?? DS.colors.primary.main}
                  duration={item.duration ?? ''}
                  isFeatured={item.is_featured}
                  thumbnail={item.url_thumb ?? undefined}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}