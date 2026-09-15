'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import VideoCard from '@/components/VideoCard'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content, Tag } from '@/types'

const DS = DESIGN_SYSTEM

export default function TagsPageClient() {
  const params          = useParams()
  const slug            = params.slug as string
  const [tag, setTag]           = useState<Tag | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!slug) return

    async function loadData() {
      try {
        const { data: tagData, error: tagError } = await supabase
          .from('tags').select('*').eq('slug', slug).single()

        if (tagError || !tagData) { setLoading(false); return }
        setTag(tagData)

        const { data: contentData, error: contentError } = await supabase
          .from('content_tags')
          .select(`
            content_id,
            contents (
              *,
              category:categories(name, slug, color, icon),
              creator:profiles(full_name),
              tags:content_tags(tag:tags(*))
            )
          `)
          .eq('tag_id', tagData.id)

        if (contentError) throw contentError

        const contentList: Content[] = []
        contentData?.forEach(ct => {
          const content = Array.isArray(ct.contents) ? ct.contents[0] : ct.contents
          if (content && content.status === 'approved') contentList.push(content as Content)
        })

        setContents(contentList)
      } catch (err) {
        console.error('[TagsPageClient]', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [slug])

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '60vh', flexDirection: 'column' as const, gap: '16px',
        fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary,
      }}>
        <div style={{
          width: '36px', height: '36px',
          border: `3px solid ${DS.colors.neutral.medium}`,
          borderTopColor: DS.colors.primary.main,
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Carregando...
      </div>
    )
  }

  if (!tag) {
    return (
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 16px', textAlign: 'center', fontFamily: DS.typography.fontFamily.body }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
        <h1 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: DS.typography.fontSize['4xl'], color: DS.colors.text.primary, marginBottom: '8px' }}>
          Tema não encontrado
        </h1>
        <p style={{ color: DS.colors.text.secondary, margin: '0 0 24px' }}>
          O tema &quot;{slug}&quot; não existe ou foi removido.
        </p>
        <a href="/tags" style={{ backgroundColor: DS.colors.primary.main, color: '#FFFFFF', textDecoration: 'none', padding: '12px 28px', borderRadius: DS.borderRadius.lg, fontFamily: DS.typography.fontFamily.body, fontWeight: DS.typography.fontWeight.semibold, fontSize: DS.typography.fontSize.base }}>
          Ver todos os temas
        </a>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontFamily: DS.typography.fontFamily.body, fontSize: DS.typography.fontSize.sm, color: DS.colors.text.muted }}>
        <a href="/"    style={{ color: DS.colors.text.muted, textDecoration: 'none' }}>Início</a>
        <span>›</span>
        <a href="/tags" style={{ color: DS.colors.text.muted, textDecoration: 'none' }}>Temas</a>
        <span>›</span>
        <span style={{ color: DS.colors.text.secondary }}>{tag.name}</span>
      </div>

      {/* Header da tag */}
      <div style={{
        backgroundColor: `${tag.color}10`, border: `2px solid ${tag.color}40`,
        borderRadius: DS.borderRadius.xl, padding: '28px 32px', marginBottom: '40px',
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' as const,
      }}>
        <div style={{
          width: '72px', height: '72px', backgroundColor: `${tag.color}20`,
          borderRadius: DS.borderRadius.xl, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '36px', flexShrink: 0,
        }}>
          {tag.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: DS.typography.fontSize['5xl'], fontWeight: DS.typography.fontWeight.bold, color: DS.colors.text.primary, marginBottom: '6px', letterSpacing: '-0.5px' }}>
            {tag.name}
          </h1>
          {tag.description && (
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: DS.typography.fontSize.lg, margin: '0 0 8px' }}>
              {tag.description}
            </p>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: `${tag.color}18`, color: tag.color, fontSize: '12px', fontFamily: DS.typography.fontFamily.body, fontWeight: DS.typography.fontWeight.semibold, padding: '3px 10px', borderRadius: DS.borderRadius.full, border: `1px solid ${tag.color}30` }}>
            {contents.length} conteúdo{contents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Grid */}
      {contents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 16px', fontFamily: DS.typography.fontFamily.body }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h3 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: DS.typography.fontSize['3xl'], color: DS.colors.text.primary, marginBottom: '8px' }}>
            Nenhum conteúdo ainda
          </h3>
          <p style={{ color: DS.colors.text.secondary, fontSize: DS.typography.fontSize.lg, margin: '0 0 24px' }}>
            Em breve teremos conteúdos sobre {tag.name}.
          </p>
          <a href="/explorar" style={{ backgroundColor: DS.colors.primary.main, color: '#FFFFFF', textDecoration: 'none', padding: '12px 28px', borderRadius: DS.borderRadius.lg, fontFamily: DS.typography.fontFamily.body, fontWeight: DS.typography.fontWeight.semibold, fontSize: DS.typography.fontSize.base, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Explorar outros conteúdos →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {contents.map(content => {
            const categoryData = Array.isArray(content.category) ? content.category[0] : content.category
            const creatorData  = Array.isArray(content.creator)  ? content.creator[0]  : content.creator
            const tagsData     = (content.tags ?? []).map((ct: any) => ct.tag ?? ct).filter(Boolean)

            return (
              <VideoCard
                key={content.id}
                id={content.id}
                title={content.title}
                creator={creatorData?.full_name ?? 'Desconhecido'}
                category={categoryData?.name ?? 'Sem categoria'}
                categoryColor={categoryData?.color ?? DS.colors.primary.accent}
                duration={content.duration ?? ''}
                isFeatured={content.is_featured ?? false}
                isCurated={content.is_featured ?? false}
                isNew={false}
                thumbnail={content.url_thumb ?? undefined}
                type={content.type ?? 'video'}
                tags={tagsData}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}