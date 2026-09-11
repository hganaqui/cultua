// src/app/categoria/[slug]/CategoriaClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VideoCard from '@/components/VideoCard'
import type { Content, Category } from '@/types'

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  louvor:      { emoji: '🎵', label: 'Louvor' },
  pregacao:    { emoji: '📖', label: 'Pregação' },
  crescimento: { emoji: '🌱', label: 'Crescimento' },
  testemunhos: { emoji: '🙏', label: 'Testemunhos' },
}

export default function CategoriaClient({ slug }: { slug: string }) {
  const [contents, setContents]   = useState<Content[]>([])
  const [category, setCategory]   = useState<Category | null>(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  const meta = CATEGORY_META[slug] ?? { emoji: '📁', label: slug }

  useEffect(() => {
    async function load() {
      // Busca categoria
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!catData) { setNotFound(true); setLoading(false); return }
      setCategory(catData)

      // Busca conteúdos da categoria
      const { data: contentData } = await supabase
        .from('contents')
        .select(`
          *,
          category:categories(id, name, slug, color, icon),
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
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A' }}>Categoria não encontrada</h1>
      <a href="/" style={{ color: '#B8860B', textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
        ← Voltar ao início
      </a>
    </main>
  )

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>

      {/* Header da categoria */}
      <div style={{
        backgroundColor: 'white', borderRadius: '20px', padding: '32px',
        marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', gap: '20px',
      }}>
        <div style={{
          width: '64px', height: '64px', flexShrink: 0,
          backgroundColor: `${category?.color}20`,
          borderRadius: '16px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '32px',
        }}>
          {meta.emoji}
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A1A', marginBottom: '4px' }}>
            {meta.label}
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>
            {category?.description}
            {contents.length > 0 && (
              <span style={{ color: '#B8860B', fontWeight: '600', marginLeft: '8px' }}>
                · {contents.length} conteúdo{contents.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Grid de conteúdos */}
      {contents.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '20px', padding: '64px 32px',
          textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{meta.emoji}</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>
            Conteúdo chegando em breve
          </h2>
          <p style={{ color: '#999', fontSize: '15px' }}>
            Estamos curadoria os melhores conteúdos de {meta.label}.
          </p>
        </div>
      ) : (
        <>
          <style>{`
            .cat-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 24px;
            }
            @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(2,1fr) !important; } }
            @media (max-width: 640px)  { .cat-grid { grid-template-columns: 1fr !important; } }
          `}</style>
          <div className="cat-grid">
            {contents.map(item => (
              <VideoCard
                key={item.id}
                id={item.id}
                title={item.title}
                creator={item.creator?.full_name ?? 'CULTUA'}
                category={item.category?.name ?? ''}
                categoryColor={item.category?.color ?? '#B8860B'}
                duration={item.duration ?? ''}
                isFeatured={item.is_featured}
                thumbnail={item.url_thumb ?? undefined}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}

function LoadingSkeleton({ meta }: { meta: { emoji: string; label: string } }) {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px', padding: '32px',
        marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px',
        animation: 'pulse 1.5s infinite',
      }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#F0F0F0', borderRadius: '16px', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {meta.emoji}
        </div>
        <div>
          <div style={{ width: '160px', height: '28px', backgroundColor: '#F0F0F0', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ width: '240px', height: '16px', backgroundColor: '#F0F0F0', borderRadius: '6px' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', animation: 'pulse 1.5s infinite' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#F0F0F0' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ height: '16px', backgroundColor: '#F0F0F0', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '12px', backgroundColor: '#F0F0F0', borderRadius: '4px', width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}