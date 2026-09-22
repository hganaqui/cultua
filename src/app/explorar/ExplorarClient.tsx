// ✅ ExplorarClient.tsx (CORRIGIDO)
// Caminho: app/explorar/ExplorarClient.tsx

'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import VideoCard from '@/components/VideoCard'
import type { Content, Tag, ContentTag } from '@/types'
import { getCategory, getContentTags } from '@/types'

const DS = DESIGN_SYSTEM

// ✅ Mapeamento de slug para ícone SVG de /public/icons (CATEGORIAS)
const CATEGORY_ICONS: Record<string, string> = {
  'louvor': '/icons/louvor.svg',
  'pregacao': '/icons/pregacao.svg',
  'crescimento': '/icons/crescimento.svg',
  'testemunhos': '/icons/testemunhos.svg',
  'familia': '/icons/familia.svg',
  'estudos': '/icons/estudos.svg',
}

// ✅ Mapeamento de slug para ícone SVG de /public/icons (TAGS)
const TAG_ICONS: Record<string, string> = {
  'alegria': '/icons/alegria.svg',
  'ansiedade': '/icons/ansiedade.svg',
  'autoestima': '/icons/autoestima.svg',
  'crescimento': '/icons/crescimento.svg',
  'depressao': '/icons/depressao.svg',
  'esperanca': '/icons/esperanca.svg',
  'espiritualidade': '/icons/espiritualidade.svg',
  'estudos': '/icons/estudos.svg',
  'explorar': '/icons/explorar.svg',
  'familia': '/icons/familia.svg',
  'louvor': '/icons/louvor.svg',
  'oracao': '/icons/oracao.svg',
  'paz': '/icons/paz.svg',
  'perdao': '/icons/perdao.svg',
  'pregacao': '/icons/pregacao.svg',
  'relacionamentos': '/icons/relacionamentos.svg',
  'saude': '/icons/saude.svg',
  'testemunhos': '/icons/testemunhos.svg',
}

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

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color?: string
  description?: string | null
}

export default function ExplorarClient() {
  const [contents, setContents] = useState<Content[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // ── Carregar categorias do banco ───────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await supabase
          .from('categories')
          .select('id, name, slug, icon, color, description')
          .order('name')
        setCategories(data ?? [])
      } catch (err) {
        console.error('[ExplorarClient] categories:', err)
      }
    }
    loadCategories()
  }, [])

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
          creator:profiles(id, full_name, avatar_url),
          content_tags(tag:tags(id, name, slug, color, icon, text_color))
        `)
        .eq('status', 'published') // ✅ CORRIGIDO: 'approved' → 'published'
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
          // ✅ CORRIGIDO: Usar getContentTags() helper
          const itemTags = getContentTags(item.content_tags)
          const itemTagSlugs = itemTags.map(tag => tag.slug)
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
    <main
      style={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: DS.colors.bg.primary,
        padding: '40px 16px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: DS.typography.fontFamily.heading,
              color: DS.colors.text.primary,
              fontSize: '32px', // ✅ CORRIGIDO: DS.typography.fontSize['5xl'] não existe
              fontWeight: DS.typography.fontWeight.bold,
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            Explorar
          </h1>
          <p
            style={{
              fontFamily: DS.typography.fontFamily.body,
              color: DS.colors.text.secondary,
              fontSize: '15px', // ✅ CORRIGIDO: DS.typography.fontSize.xl não existe
            }}
          >
            Descubra conteúdos para edificar sua fé
          </p>
        </div>

        {/* ── FILTRO DE CATEGORIAS ── */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '12px',
              fontWeight: DS.typography.fontWeight.semibold,
              color: DS.colors.text.secondary,
              textTransform: 'uppercase' as const,
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}
          >
            Categorias
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap' as const,
            }}
          >
            {/* Botão "Todas" */}
            <button
              onClick={() => setActiveCategory(null)}
              style={filterBtnStyle(activeCategory === null)}
              onMouseEnter={(e) => {
                if (activeCategory !== null) {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.color = DS.colors.primary.main
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== null) {
                  e.currentTarget.style.borderColor = DS.colors.neutral.medium
                  e.currentTarget.style.color = DS.colors.text.secondary
                }
              }}
            >
              Todas
            </button>

            {/* ✅ Botões de categoria com SVG do /public/icons */}
            {categories.map(cat => {
              const iconPath = CATEGORY_ICONS[cat.slug] || '/icons/estudos.svg'

              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  style={filterBtnStyle(activeCategory === cat.slug)}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat.slug) {
                      e.currentTarget.style.borderColor = DS.colors.primary.main
                      e.currentTarget.style.color = DS.colors.primary.main
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat.slug) {
                      e.currentTarget.style.borderColor = DS.colors.neutral.medium
                      e.currentTarget.style.color = DS.colors.text.secondary
                    }
                  }}
                >
                  {/* ✅ SVG sempre de /public/icons */}
                  <Image
                    src={iconPath}
                    alt={cat.name}
                    width={14}
                    height={14}
                    style={{ display: 'block' }}
                  />
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── FILTRO DE TAGS ── */}
        {tags.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontFamily: DS.typography.fontFamily.body,
                fontSize: '12px',
                fontWeight: DS.typography.fontWeight.semibold,
                color: DS.colors.text.secondary,
                textTransform: 'uppercase' as const,
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}
            >
              Temas (Selecione múltiplas para filtrar)
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap' as const,
              }}
            >
              {tags.map(tag => {
                // ✅ Usar mapeamento para pegar SVG correto baseado no slug
                const iconPath = TAG_ICONS[tag.slug] || '/icons/explorar.svg'

                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.slug)}
                    style={{
                      ...filterBtnStyle(activeTags.includes(tag.slug)),
                      backgroundColor: activeTags.includes(tag.slug)
                        ? tag.color
                        : DS.colors.bg.secondary,
                      borderColor: activeTags.includes(tag.slug)
                        ? tag.color
                        : DS.colors.neutral.medium,
                      color: activeTags.includes(tag.slug)
                        ? DS.colors.text.primary
                        : tag.color,
                    }}
                    onMouseEnter={(e) => {
                      if (!activeTags.includes(tag.slug)) {
                        e.currentTarget.style.borderColor = tag.color
                        e.currentTarget.style.backgroundColor = `${tag.color}12`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!activeTags.includes(tag.slug)) {
                        e.currentTarget.style.borderColor = DS.colors.neutral.medium
                        e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                      }
                    }}
                  >
                    {/* ✅ SVG das tags de /public/icons */}
                    <Image
                      src={iconPath}
                      alt={tag.name}
                      width={14}
                      height={14}
                      style={{ display: 'block' }}
                    />
                    <span style={{ display: 'inline' }}>
                      {tag.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── GRID ── */}
        {loading ? (
          <div
            style={{
              fontFamily: DS.typography.fontFamily.body,
              color: DS.colors.text.secondary,
              textAlign: 'center',
              padding: '48px',
            }}
          >
            Carregando...
          </div>
        ) : contents.length === 0 ? (
          <div
            style={{
              backgroundColor: DS.colors.bg.secondary,
              borderRadius: DS.borderRadius.xl,
              padding: '64px 32px',
              textAlign: 'center',
              border: `1px solid ${DS.colors.neutral.light}`,
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h2
              style={{
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '20px', // ✅ CORRIGIDO: DS.typography.fontSize['3xl'] não existe
                color: DS.colors.text.primary,
                marginBottom: '8px',
              }}
            >
              Nenhum conteúdo encontrado
            </h2>
            <p
              style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
              }}
            >
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
                // ✅ CORRIGIDO: Usar getContentTags() para extrair tags
                const contentTags = getContentTags(item.content_tags)

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
                    tags={contentTags} // ✅ CORRIGIDO: Passar tags extraídas
                    type={item.type} // ✅ ADICIONADO: type do conteúdo
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