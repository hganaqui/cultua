// src/app/HomeClient.tsx
'use client'

import { useEffect, useState } from 'react'
import VideoCard from '@/components/VideoCard'
import { getFeaturedContents } from '@/lib/db'
import type { Content } from '@/types'
import { getCategory } from '@/types'

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
    <section id="conteudo" style={{ padding: '64px 16px', backgroundColor: 'white' }}>
      <style>{`
        .video-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media (max-width: 1024px) { .video-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px)  { .video-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>
              ✨ Destaques da Semana
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Escolhidos pela nossa equipe para edificar você
            </p>
          </div>
          <a href="/explorar" style={{
            color: '#B8860B', textDecoration: 'none', fontSize: '14px',
            fontWeight: '600', border: '1px solid #B8860B',
            padding: '8px 16px', borderRadius: '8px',
          }}>
            Ver todos →
          </a>
        </div>

        {loading ? (
          <div className="video-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                backgroundColor: '#F5F5F5', borderRadius: '16px',
                overflow: 'hidden', animation: 'pulse 1.5s infinite',
              }}>
                <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#E0E0E0' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '16px', backgroundColor: '#E0E0E0', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '12px', backgroundColor: '#E0E0E0', borderRadius: '4px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
            <p>Conteúdos chegando em breve. Volte logo!</p>
          </div>
        ) : (
          <div className="video-grid">
            {contents.map(item => {
              // ✅ resolve o join antes de acessar propriedades
              const cat = getCategory(item.category)
              return (
                <VideoCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  creator={item.creator?.full_name ?? 'CULTUA'}
                  category={cat?.name ?? ''}
                  categoryColor={cat?.color ?? '#B8860B'}
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