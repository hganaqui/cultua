'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import VideoCard from '@/components/VideoCard'
import type { Content, Tag } from '@/types'
import { getCategory } from '@/types'

const DS = DESIGN_SYSTEM

const CATEGORIES = [
  { slug: 'louvor',      label: 'Louvor',      icon: '/icons/louvor.svg' },
  { slug: 'pregacao',    label: 'Pregação',    icon: '/icons/pregacao.svg' },
  { slug: 'crescimento', label: 'Crescimento', icon: '/icons/crescimento.svg' },
  { slug: 'testemunhos', label: 'Testemunhos', icon: '/icons/testemunhos.svg' },
  { slug: 'familia',     label: 'Família',     icon: '/icons/familia.svg' },
  { slug: 'estudos',     label: 'Estudos',     icon: '/icons/estudos.svg' },
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  }
}

export default function ExplorarClient() {
  const [contents, setContents]       = useState<Content[]>([])
  const [tags, setTags]               = useState<Tag[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTags, setActiveTags]   = useState<string[]>([])
  const [loading, setLoading]         = useState(true)

  // ── Carregar tags ao montar ────────────────────────────────────────
  useEffect(() => {
    async function loadTags() {
      try {
        const { data } = await supabase
          .from('tags')
          .select('*')
          .order('name')
        setTags(data ?? [])
      } catch (err) {
        console.error('[ExplorarClient] tags:', err)
      }
    }
    loadTags()
  }, [])

  // ── Carregar conteúdos com filtros ─────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)

      let query = supabase
        .from('contents')
        .select(`
          *,
          category:categories(id, name, slug, color, icon, description, created_at),
          creator:profiles(full_name),
          tags:content_tags(tag:tags(*))
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(24)

      // ── Filtro por categoria ────────────────────────────────────────
      if (activeCategory) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', activeCategory)
          .single()
        if (cat?.id) query = query.eq('category_id', cat.id)
      }

      const { data } = await query
      let contentList = (data as Content[]) ?? []

      // ── Filtro por tags (client-side — AND logic) ──────────────────
      if (activeTags.length > 0) {
        contentList = contentList.filter(item => {
          const itemTagSlugs = (item.tags ?? []).map((ct: any) => {
            const tag = ct.tag ?? ct
            return typeof tag === 'object' ? tag.slug : tag
          })
          // ✅ Conteúdo PRECISA ter TODAS as tags selecionadas
          return activeTags.every(tagSlug => itemTagSlugs.includes(tagSlug))
        })
      }

      setContents(contentList)
      setLoading(false)
    }
    load()
  }, [activeCategory, activeTags])

  // ── Toggle tag selecionada ─────────────────────────────────────────
  function toggleTag(slug: string) {
    setActiveTags(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

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

        {/* ── FILTRO DE CATEGORIAS ── */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontFamily: DS.typography.fontFamily.body,
            fontSize: '12px',
            fontWeight: DS.typography.fontWeight.semibold,
            color: DS.colors.text.secondary,
            textTransform: 'uppercase' as const,
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}>
            Categorias
          </div>
          <div style={{
            display: 'flex', gap: '8px',
            flexWrap: 'wrap' as const,
          }}>
            {/* Botão "Todos" */}
            <button
              onClick={() => setActiveCategory(null)}
              style={filterBtnStyle(activeCategory === null)}
              onMouseEnter={e => {
                if (activeCategory !== null) {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.color = DS.colors.primary.main
                }
              }}
              onMouseLeave={e => {
                if (activeCategory !== null) {
                  e.currentTarget.style.borderColor = DS.colors.neutral.medium
                  e.currentTarget.style.color = DS.colors.text.secondary
                }
              }}
            >
              Todas
            </button>

            {/* Botões de categoria */}
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                style={filterBtnStyle(activeCategory === cat.slug)}
                onMouseEnter={e => {
                  if (activeCategory !== cat.slug) {
                    e.currentTarget.style.borderColor = DS.colors.primary.main
                    e.currentTarget.style.color = DS.colors.primary.main
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat.slug) {
                    e.currentTarget.style.borderColor = DS.colors.neutral.medium
                    e.currentTarget.style.color = DS.colors.text.secondary
                  }
                }}
              >
                <Image
                  src={cat.icon}
                  alt={cat.label}
                  width={14}
                  height={14}
                />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── FILTRO DE TAGS ── */}
        {tags.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '12px',
              fontWeight: DS.typography.fontWeight.semibold,
              color: DS.colors.text.secondary,
              textTransform: 'uppercase' as const,
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}>
              Temas (Selecione múltiplas para filtrar)
            </div>
            <div style={{
              display: 'flex', gap: '8px',
              flexWrap: 'wrap' as const,
            }}>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.slug)}
                  style={filterBtnStyle(activeTags.includes(tag.slug))}
                  onMouseEnter={e => {
                    if (!activeTags.includes(tag.slug)) {
                      e.currentTarget.style.borderColor = tag.color
                      e.currentTarget.style.color = tag.color
                    }
                  }}
                  onMouseLeave={e => {
                    if (!activeTags.includes(tag.slug)) {
                      e.currentTarget.style.borderColor = DS.colors.neutral.medium
                      e.currentTarget.style.color = DS.colors.text.secondary
                    }
                  }}
                >
                  {tag.icon} {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── GRID ── */}
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
              {activeTags.length > 0 || activeCategory
                ? 'Tente outro filtro.'
                : 'Em breve teremos mais conteúdos aqui.'}
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