'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import VideoCard from '@/components/VideoCard'
import type { Content } from '@/types'
import { getCategory } from '@/types'

const DS = DESIGN_SYSTEM

const CATEGORIES = [
  { slug: 'louvor',      label: 'Louvor',      emoji: '🎵' },
  { slug: 'pregacao',    label: 'Pregação',    emoji: '📖' },
  { slug: 'crescimento', label: 'Crescimento', emoji: '🌱' },
  { slug: 'testemunhos', label: 'Testemunhos', emoji: '🙏' },
  { slug: 'oracao',      label: 'Oração',      emoji: '🤲' },
  { slug: 'familia',     label: 'Família',     emoji: '🏠' },
  { slug: 'estudos',     label: 'Estudos',     emoji: '📚' },
]

// ── Estilo base dos botões de filtro ────────────────────────────────
function filterBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 18px',
    borderRadius: DS.borderRadius.full,
    border: `1.5px solid ${active ? DS.colors.primary.main : DS.colors.neutral.medium}`,
    fontFamily: DS.typography.fontFamily.body,
    fontSize: '13px',
    fontWeight: DS.typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: DS.transitions.fast,
    backgroundColor: active ? DS.colors.primary.main : DS.colors.bg.secondary,
    color: active ? '#FFFFFF' : DS.colors.text.secondary,
  }
}

export default function ExplorarClient() {
  const [contents, setContents]     = useState<Content[]>([])
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      let query = supabase
        .from('contents')
        .select(`
          *,
          category:categories(id, name, slug, color, icon, description, created_at),
          creator:profiles(full_name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(24)

      if (activeSlug) {
        const { data: cat } = await supabase
          .from('categories').select('id').eq('slug', activeSlug).single()
        if (cat?.id) query = query.eq('category_id', cat.id)
      }

      const { data } = await query
      setContents((data as Content[]) ?? [])
      setLoading(false)
    }
    load()
  }, [activeSlug])

  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: DS.colors.bg.primary,
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            color: DS.colors.text.primary,
            fontSize: DS.typography.fontSize['5xl'],
            fontWeight: DS.typography.fontWeight.bold,
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}>
            Explorar
          </h1>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary,
            fontSize: DS.typography.fontSize.xl,
          }}>
            Descubra conteúdos para edificar sua fé
          </p>
        </div>

        {/* Filtro de categorias */}
        <div style={{
          display: 'flex', gap: '8px',
          flexWrap: 'wrap' as const,
          marginBottom: '32px',
        }}>
          {/* Botão "Todos" */}
          <button
            onClick={() => setActiveSlug(null)}
            style={filterBtnStyle(activeSlug === null)}
            onMouseEnter={e => {
              if (activeSlug !== null) {
                e.currentTarget.style.borderColor = DS.colors.primary.main
                e.currentTarget.style.color = DS.colors.primary.main
              }
            }}
            onMouseLeave={e => {
              if (activeSlug !== null) {
                e.currentTarget.style.borderColor = DS.colors.neutral.medium
                e.currentTarget.style.color = DS.colors.text.secondary
              }
            }}
          >
            Todos
          </button>

          {/* Botões de categoria */}
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveSlug(cat.slug)}
              style={filterBtnStyle(activeSlug === cat.slug)}
              onMouseEnter={e => {
                if (activeSlug !== cat.slug) {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.color = DS.colors.primary.main
                }
              }}
              onMouseLeave={e => {
                if (activeSlug !== cat.slug) {
                  e.currentTarget.style.borderColor = DS.colors.neutral.medium
                  e.currentTarget.style.color = DS.colors.text.secondary
                }
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary,
            textAlign: 'center',
            padding: '48px',
          }}>
            Carregando...
          </div>
        ) : contents.length === 0 ? (
          <div style={{
            backgroundColor: DS.colors.bg.secondary,
            borderRadius: DS.borderRadius.xl,
            padding: '64px 32px',
            textAlign: 'center',
            border: `1px solid ${DS.colors.neutral.light}`,
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h2 style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: DS.typography.fontSize['3xl'],
              color: DS.colors.text.primary,
              marginBottom: '8px',
            }}>
              Nenhum conteúdo encontrado
            </h2>
            <p style={{
              fontFamily: DS.typography.fontFamily.body,
              color: DS.colors.text.secondary,
            }}>
              Em breve teremos mais conteúdos aqui.
            </p>
          </div>
        ) : (
          <>
            <style>{`
              .explorar-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
              }
              @media (max-width: 1024px) {
                .explorar-grid { grid-template-columns: repeat(2, 1fr) !important; }
              }
              @media (max-width: 640px) {
                .explorar-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
            <div className="explorar-grid">
              {contents.map(item => {
                const cat = getCategory(item.category)
                return (
                  <VideoCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    creator={(item.creator as any)?.full_name ?? 'CULTUA'}
                    category={cat?.name ?? ''}
                    categoryColor={cat?.color ?? DS.colors.primary.main}
                    duration={item.duration ?? ''}
                    isFeatured={item.is_featured}
                    thumbnail={item.url_thumb ?? undefined}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </main>
  )
}