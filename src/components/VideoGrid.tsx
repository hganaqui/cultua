// ✅ 2️⃣ VideoGrid.tsx
// Caminho: app/components/VideoGrid.tsx

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import VideoCard from '@/components/VideoCard'
import type { Content, Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface VideoGridProps {
  categorySlug?: string
  featured?: boolean
  limit?: number
  title?: string
  showFilters?: boolean
}

export default function VideoGrid({
  categorySlug,
  featured = false,
  limit = 20,
  title = 'Conteúdo Destacado',
  showFilters = false,
}: VideoGridProps) {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredContents, setFilteredContents] = useState<Content[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  // ✅ Carregar conteúdos
  useEffect(() => {
    async function loadContents() {
      try {
        let query = supabase
          .from('contents')
          .select(
            `
            id,
            title,
            description,
            duration,
            url_thumb,
            url_media,
            status,
            is_featured,
            view_count,
            created_at,
            category_id,
            category:categories(id, name, slug, color, icon),
            creator:profiles(id, full_name, avatar_url),
            content_tags(tag:tags(id, name, slug, icon, color))
          `
          )
          .eq('status', 'published')
          .order(sortBy === 'recent' ? 'created_at' : 'view_count', {
            ascending: sortBy === 'recent' ? false : false,
          })
          .limit(limit)

        if (categorySlug) {
          query = query.eq('category.slug', categorySlug)
        }

        if (featured) {
          query = query.eq('is_featured', true)
        }

        const { data, error } = await query

        if (error) {
          console.error('[VideoGrid] Erro ao carregar:', error)
          setContents([])
        } else {
          setContents((data as unknown as Content[]) ?? [])
        }
      } catch (err) {
        console.error('[VideoGrid] Exceção:', err)
      } finally {
        setLoading(false)
      }
    }

    loadContents()
  }, [categorySlug, featured, limit, sortBy])

  // ✅ Filtrar por busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContents(contents)
    } else {
      const filtered = contents.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.creator?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredContents(filtered)
    }
  }, [contents, searchTerm])

  if (loading) {
    return (
      <section style={{ padding: '64px 16px', backgroundColor: DS.colors.bg.primary }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {title && (
            <h2
              style={{
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '28px',
                fontWeight: DS.typography.fontWeight.bold,
                color: DS.colors.text.primary,
                marginBottom: '32px',
              }}
            >
              {title}
            </h2>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: DS.colors.neutral.medium,
                  borderRadius: DS.borderRadius.lg,
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section style={{ padding: '64px 16px', backgroundColor: DS.colors.bg.primary }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        @media (max-width: 1024px) {
          .video-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* ✅ HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap' as const,
          }}
        >
          {title && (
            <h2
              style={{
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '28px',
                fontWeight: DS.typography.fontWeight.bold,
                color: DS.colors.text.primary,
                margin: 0,
              }}
            >
              {title}
            </h2>
          )}

          {/* ✅ CONTROLES */}
          {showFilters && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap' as const,
              }}
            >
              {/* Busca */}
              <input
                type="text"
                placeholder="Buscar conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: DS.borderRadius.lg,
                  border: `1.5px solid ${DS.colors.neutral.medium}`,
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '14px',
                  backgroundColor: DS.colors.bg.secondary,
                  color: DS.colors.text.primary,
                  transition: DS.transitions.fast,
                  minWidth: '200px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.neutral.medium
                }}
              />

              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                style={{
                  padding: '10px 14px',
                  borderRadius: DS.borderRadius.lg,
                  border: `1.5px solid ${DS.colors.neutral.medium}`,
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '14px',
                  backgroundColor: DS.colors.bg.secondary,
                  color: DS.colors.text.primary,
                  cursor: 'pointer',
                  transition: DS.transitions.fast,
                  outline: 'none',
                }}
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Populares</option>
              </select>
            </div>
          )}
        </div>

        {/* ✅ GRID DE VÍDEOS */}
        {filteredContents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: DS.colors.bg.secondary,
              borderRadius: DS.borderRadius.xl,
              border: `1px solid ${DS.colors.neutral.light}`,
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p
              style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '15px',
                margin: 0,
              }}
            >
              {searchTerm
                ? 'Nenhum conteúdo encontrado para sua busca.'
                : 'Nenhum conteúdo disponível ainda.'}
            </p>
          </div>
        ) : (
          <div className="video-grid">
            {filteredContents.map((content) => {
              const category = content.category as any
              const creator = content.creator as any
              const tags = (content.content_tags as any[])?.map((ct: any) => ct.tag) ?? []

              return (
                <VideoCard
                  key={content.id}
                  id={content.id}
                  title={content.title}
                  creator={creator?.full_name ?? 'CULTUA'}
                  category={category?.name ?? 'Geral'}
                  categoryColor={category?.color ?? DS.colors.primary.main}
                  duration={content.duration ?? '--:--'}
                  isFeatured={content.is_featured}
                  thumbnail={content.url_thumb ?? undefined}
                  tags={tags}
                  type={content.type as 'video' | 'audio' | 'text' | undefined}
                />
              )
            })}
          </div>
        )}

        {/* ✅ CONTADOR DE RESULTADOS */}
        {showFilters && filteredContents.length > 0 && (
          <div
            style={{
              marginTop: '32px',
              textAlign: 'center',
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '13px',
              color: DS.colors.text.secondary,
            }}
          >
            Exibindo {filteredContents.length} de {contents.length} conteúdos
          </div>
        )}
      </div>
    </section>
  )
}