'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import VideoCard from '@/components/VideoCard'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content, Tag } from '@/types'

const DS = DESIGN_SYSTEM

export default function TagsPageClient() {
  const params = useParams()
  const slug = params.slug as string

  const [tag, setTag] = useState<Tag | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Buscar tag
        const { data: tagData } = await supabase
          .from('tags')
          .select('*')
          .eq('slug', slug)
          .single()

        setTag(tagData)

        if (!tagData) return

        // Buscar conteudos com essa tag
        const { data: contentData } = await supabase
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
          .eq('contents.status', 'approved')

        const contentList: Content[] = []
        contentData?.forEach(ct => {
          const content = Array.isArray(ct.contents) 
            ? ct.contents[0] 
            : ct.contents
          
          if (content) {
            contentList.push(content as Content)
          }
        })

        setContents(contentList)
      } catch (err) {
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '60vh', 
      color: DS.colors.text.secondary 
    }}>
      Carregando...
    </div>
  )

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
      {tag && (
        <div style={{
          backgroundColor: tag.color + '15',
          border: `2px solid ${tag.color}`,
          borderRadius: DS.borderRadius.lg,
          padding: '32px',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{tag.icon}</div>
          <h1 style={{ color: DS.colors.text.dark, fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            {tag.name}
          </h1>
          <p style={{ color: DS.colors.text.secondary, fontSize: '16px', margin: 0 }}>
            {tag.description}
          </p>
          <p style={{ color: DS.colors.text.secondary, fontSize: '14px', marginTop: '12px', margin: 0 }}>
            {contents.length} conteúdo{contents.length !== 1 ? 's' : ''} disponível{contents.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {contents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: DS.colors.text.secondary,
        }}>
          <p>Nenhum conteúdo com este tema</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
        }}>
          {contents.map(content => {
            const categoryData = Array.isArray(content.category) 
              ? content.category[0] 
              : content.category
            
            const creatorData = Array.isArray(content.creator)
              ? content.creator[0]
              : content.creator

            return (
              <VideoCard
                key={content.id}
                id={content.id}
                title={content.title}
                creator={creatorData?.full_name || 'Desconhecido'}
                category={categoryData?.name || 'Sem categoria'}
                categoryColor={categoryData?.color || DS.colors.primary.main}
                duration={content.duration || '00:00'}
                isFeatured={content.is_featured}
                isNew={false}
                thumbnail={content.url_thumb || undefined}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}