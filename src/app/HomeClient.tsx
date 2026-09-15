'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import VideoCard from '@/components/VideoCard'
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
        .video-grid { 
          display: grid; 
          grid-template-columns: repeat(3,1fr); 
          gap: 24px; 
        }
        @media (max-width: 1024px) { 
          .video-grid { 
            grid-template-columns: repeat(2,1fr) !important; 
          } 
        }
        @media (max-width: 640px)  { 
          .video-grid { 
            grid-template-columns: 1fr !important; 
          } 
        }
        @keyframes pulse { 
          0%,100%{opacity:1} 
          50%{opacity:.5} 
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header da seção */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          marginBottom: '32px',
          flexWrap: 'wrap', 
          gap: '16px',
        }}>
          <div>
            <h2 style={{
              fontSize: '26px', 
              fontWeight: '800',
              color: DS.colors.text.dark,
              marginBottom: '4px',
            }}>
              ✨ Destaques da Semana
            </h2>
            <p style={{ color: DS.colors.text.secondary, fontSize: '14px' }}>
              Escolhidos pela nossa equipe para edificar você
            </p>
          </div>
          <Link href="/explorar" style={{
            color: DS.colors.primary.main, 
            textDecoration: 'none', 
            fontSize: '14px',
            fontWeight: '600', 
            border: `1px solid ${DS.colors.primary.main}40`,
            padding: '8px 16px', 
            borderRadius: '8px',
            transition: DS.transitions.base,
          }}
            onMouseEnter={e => {
              const link = e.currentTarget as HTMLAnchorElement
              link.style.backgroundColor = `${DS.colors.primary.main}10`
            }}
            onMouseLeave={e => {
              const link = e.currentTarget as HTMLAnchorElement
              link.style.backgroundColor = 'transparent'
            }}
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
                borderRadius: '16px', 
                overflow: 'hidden',
                animation: 'pulse 1.5s infinite',
              }}>
                <div style={{
                  width: '100%', 
                  aspectRatio: '16/9',
                  backgroundColor: DS.colors.neutral.medium,
                }} />
                <div style={{ padding: '16px' }}>
                  <div style={{
                    height: '16px', 
                    backgroundColor: DS.colors.neutral.medium,
                    borderRadius: '4px', 
                    marginBottom: '8px',
                  }} />
                  <div style={{
                    height: '12px', 
                    backgroundColor: DS.colors.neutral.medium,
                    borderRadius: '4px', 
                    width: '60%',
                  }} />
                </div>
              </div>
            ))}
          </div>

        /* Vazio */
        ) : contents.length === 0 ? (
          <div style={{
            textAlign: 'center', 
            padding: '60px',
            backgroundColor: DS.colors.bg.secondary,
            borderRadius: '16px', 
            border: `1px solid ${DS.colors.neutral.light}`,
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
            <p style={{ color: DS.colors.text.secondary, fontSize: '15px' }}>
              Conteúdos chegando em breve. Volte logo!
            </p>
          </div>

        /* Grid */
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