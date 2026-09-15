'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VideoCard from '@/components/VideoCard'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content, Category } from '@/types'
import { getCategory } from '@/types'

const DS = DESIGN_SYSTEM

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  louvor:      { emoji: '🎵', label: 'Louvor' },
  pregacao:    { emoji: '📖', label: 'Pregação' },
  crescimento: { emoji: '🌱', label: 'Crescimento' },
  testemunhos: { emoji: '🙏', label: 'Testemunhos' },
}

export default function CategoriaClient({ slug }: { slug: string }) {
  const [contents, setContents] = useState<Content[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  const meta = CATEGORY_META[slug] ?? { emoji: '📁', label: slug }

  useEffect(() => {
    async function load() {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!catData) { setNotFound(true); setLoading(false); return }
      setCategory(catData)

      const { data: contentData } = await supabase
        .from('contents')
        .select(`
          *,
          category:categories(id, name, slug, color, icon, description, created_at),
          creator:profiles(id, full_name, avatar_url)
        `)
        .eq('status', 'approved')
        .eq('category_id', catData.id)
        .order('created_at', { ascending: false })

      setContents((contentData as Content[]) ?? [])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <LoadingSkeleton meta={meta} />

  if (notFound) return (
    <main style={{ maxWidth: '800px', margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>😔</div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: DS.colors.text.dark }}>Categoria não encontrada</h1>
      <a href="/" style={{ color: DS.colors.primary.main, textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
        ← Voltar ao início
      </a>
    </main>
  )

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>

      {/* Header da categoria */}
      <div style={{
        backgroundColor: DS.colors.bg.secondary, 
        borderRadius: '20px', 
        padding: '32px',
        marginBottom: '32px', 
        boxShadow: DS.shadows.sm,
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        border: `1px solid ${DS.colors.neutral.light}`,
      }}>
        <div style={{
          width: '64px', 
          height: '64px', 
          flexShrink: 0,
          backgroundColor: `${category?.color ?? DS.colors.primary.main}20`,
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center', 
          fontSize: '32px',
        }}>
          {meta.emoji}
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: DS.colors.text.dark, marginBottom: '4px' }}>
            {meta.label}
          </h1>
          <p style={{ color: DS.colors.text.secondary, fontSize: '15px' }}>
            {category?.description}
            {contents.length > 0 && (
              <span style={{ color: DS.colors.primary.main, fontWeight: '600', marginLeft: '8px' }}>
                · {contents.length} conteúdo{contents.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Grid de conteúdos */}
      {contents.length === 0 ? (
        <div style={{
          backgroundColor: DS.colors.bg.secondary, 
          borderRadius: '20px', 
          padding: '64px 32px',
          textAlign: 'center', 
          boxShadow: DS.shadows.sm,
          border: `1px solid ${DS.colors.neutral.light}`,
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{meta.emoji}</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: DS.colors.text.dark, marginBottom: '8px' }}>
            Conteúdo chegando em breve
          </h2>
          <p style={{ color: DS.colors.text.secondary, fontSize: '15px' }}>
            Estamos curando os melhores conteúdos de {meta.label}.
          </p>
        </div>
      ) : (
        <>
          <style>{`
            .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
            @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(2,1fr) !important; } }
            @media (max-width: 640px)  { .cat-grid { grid-template-columns: 1fr !important; } }
          `}</style>
          <div className="cat-grid">
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
        </>
      )}
    </main>
  )
}

function LoadingSkeleton({ meta }: { meta: { emoji: string; label: string } }) {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      <div style={{
        backgroundColor: '#F0F0F0', 
        borderRadius: '20px', 
        padding: '32px',
        marginBottom: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        animation: 'pulse 1.5s infinite',
      }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#E0E0E0', borderRadius: '16px', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {meta.emoji}
        </div>
        <div>
          <div style={{ width: '160px', height: '28px', backgroundColor: '#E0E0E0', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ width: '240px', height: '16px', backgroundColor: '#E0E0E0', borderRadius: '6px' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ backgroundColor: '#F0F0F0', borderRadius: '16px', overflow: 'hidden', animation: 'pulse 1.5s infinite' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#E0E0E0' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ height: '16px', backgroundColor: '#E0E0E0', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '12px', backgroundColor: '#E0E0E0', borderRadius: '4px', width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}