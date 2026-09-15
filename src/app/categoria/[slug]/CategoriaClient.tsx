'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VideoCard from '@/components/VideoCard'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content, Category } from '@/types'
import { getCategory } from '@/types'

const DS = DESIGN_SYSTEM

// ✅ SVGs em vez de emojis
const CATEGORY_META: Record<string, { icon: string; label: string; color: string }> = {
  louvor:      { icon: '/icons/louvor.svg',      label: 'Louvor',      color: '#7C3AED' },
  pregacao:    { icon: '/icons/pregacao.svg',    label: 'Pregação',    color: '#D4A373' },
  crescimento: { icon: '/icons/crescimento.svg', label: 'Crescimento', color: DS.colors.primary.main },
  testemunhos: { icon: '/icons/testemunhos.svg', label: 'Testemunhos', color: '#D97706' },
  familia:     { icon: '/icons/familia.svg',     label: 'Família',     color: DS.colors.primary.accent },
  estudos:     { icon: '/icons/estudos.svg',     label: 'Estudos',     color: '#6B7F6B' },
}

export default function CategoriaClient({ slug }: { slug: string }) {
  const [contents, setContents] = useState<Content[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  const meta = CATEGORY_META[slug] ?? { icon: '📁', label: slug, color: DS.colors.primary.main }

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
      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        fontSize: '22px', fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.text.primary,
      }}>
        Categoria não encontrada
      </h1>
      <a href="/" style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.primary.main,
        textDecoration: 'none', marginTop: '16px', display: 'inline-block',
      }}>
        ← Voltar ao início
      </a>
    </main>
  )

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>

      {/* Header da categoria */}
      <div style={{
        backgroundColor: `${meta.color}15`,
        borderRadius: DS.borderRadius.xl,
        padding: '32px', marginBottom: '32px',
        boxShadow: DS.shadows.sm,
        display: 'flex', alignItems: 'center', gap: '20px',
        border: `1px solid ${meta.color}40`,
      }}>
        {/* ✅ SVG em vez de emoji */}
        <div style={{
          width: '64px', height: '64px', flexShrink: 0,
          backgroundColor: `${meta.color}18`,
          borderRadius: DS.borderRadius.lg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Image
            src={meta.icon}
            alt={meta.label}
            width={32}
            height={32}
          />
        </div>

        <div>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '28px', fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.primary, marginBottom: '4px',
          }}>
            {meta.label}
          </h1>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary, fontSize: '15px',
          }}>
            {category?.description}
            {contents.length > 0 && (
              <span style={{
                fontFamily: DS.typography.fontFamily.body,
                color: meta.color,
                fontWeight: DS.typography.fontWeight.semibold,
                marginLeft: '8px',
              }}>
                · {contents.length} conteúdo{contents.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Grid */}
      {contents.length === 0 ? (
        <div style={{
          backgroundColor: DS.colors.bg.secondary,
          borderRadius: DS.borderRadius.xl,
          padding: '64px 32px', textAlign: 'center',
          boxShadow: DS.shadows.sm,
          border: `1px solid ${DS.colors.neutral.light}`,
        }}>
          <div style={{
            width: '64px', height: '64px',
            margin: '0 auto 12px',
            backgroundColor: `${meta.color}15`,
            borderRadius: DS.borderRadius.lg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image
              src={meta.icon}
              alt={meta.label}
              width={32}
              height={32}
            />
          </div>
          <h2 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: '20px', fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.primary, marginBottom: '8px',
          }}>
            Conteúdo chegando em breve
          </h2>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary, fontSize: '15px',
          }}>
            Estamos curando os melhores conteúdos de {meta.label}.
          </p>
        </div>
      ) : (
        <>
          <style>{`
            .cat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
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

function LoadingSkeleton({ meta }: { meta: { icon: string; label: string; color: string } }) {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      <div style={{
        backgroundColor: `${meta.color}15`,
        borderRadius: DS.borderRadius.xl, padding: '32px',
        marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px',
        animation: 'pulse 1.5s infinite',
      }}>
        <div style={{
          width: '64px', height: '64px', backgroundColor: `${meta.color}30`,
          borderRadius: DS.borderRadius.lg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Image
            src={meta.icon}
            alt={meta.label}
            width={32}
            height={32}
          />
        </div>
        <div>
          <div style={{ width: '160px', height: '28px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.md, marginBottom: '8px' }} />
          <div style={{ width: '240px', height: '16px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.md }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ backgroundColor: DS.colors.neutral.light, borderRadius: DS.borderRadius.lg, overflow: 'hidden', animation: 'pulse 1.5s infinite' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: DS.colors.neutral.medium }} />
            <div style={{ padding: '16px' }}>
              <div style={{ height: '16px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, marginBottom: '8px' }} />
              <div style={{ height: '12px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}