'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getContentById, incrementViewCount, saveWatchHistory } from '@/lib/db'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content } from '@/types'
import { getCategory } from '@/types'
import type { User } from '@supabase/supabase-js'

const DS = DESIGN_SYSTEM

export default function ContentPlayer({ contentId }: { contentId: string }) {
  const [content, setContent]   = useState<Content | null>(null)
  const [user, setUser]         = useState<User | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const viewCounted             = useRef(false)

  useEffect(() => {
    async function load() {
      const [{ data: contentData }, { data: { user: currentUser } }] = await Promise.all([
        getContentById(contentId),
        supabase.auth.getUser(),
      ])

      if (!contentData) { setNotFound(true); setLoading(false); return }
      setContent(contentData)
      setUser(currentUser)
      setLoading(false)

      if (!viewCounted.current) {
        viewCounted.current = true
        incrementViewCount(contentId)
      }
    }
    load()
  }, [contentId])

  useEffect(() => {
    if (!user || !content) return
    return () => { saveWatchHistory(user.id, content.id, 0, false) }
  }, [user, content])

  if (loading)  return <PlayerSkeleton />
  if (notFound) return <NotFound />
  if (!content) return null

  const cat         = getCategory(content.category)
  const categoryColor = cat?.color ?? DS.colors.primary.main
  const categoryIcon  = cat?.icon  ?? '🎵'
  const categoryName  = cat?.name  ?? ''
  const categorySlug  = cat?.slug  ?? ''
  const creatorName   = content.creator?.full_name ?? 'CULTUA'

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <style>{`
        .player-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
        @media (max-width: 900px) { .player-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="player-grid">
        {/* Player */}
        <div>
          <div style={{
            width: '100%', 
            aspectRatio: '16/9', 
            backgroundColor: '#000',
            borderRadius: DS.borderRadius.lg, 
            overflow: 'hidden', 
            marginBottom: '20px',
          }}>
            {content.url_media ? (
              <video
                src={content.url_media}
                controls
                autoPlay={false}
                controlsList="nodownload"
                onContextMenu={e => e.preventDefault()}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div style={{
                width: '100%', 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: DS.colors.text.secondary,
              }}>
                <div style={{ fontSize: '64px', marginBottom: '12px' }}>{categoryIcon}</div>
                <p style={{ fontSize: '14px' }}>Mídia em breve</p>
              </div>
            )}
          </div>

          <span style={{
            display: 'inline-block',
            backgroundColor: `${categoryColor}20`, 
            color: categoryColor,
            fontSize: '12px', 
            fontWeight: '700', 
            padding: '4px 12px',
            borderRadius: DS.borderRadius.full, 
            border: `1px solid ${categoryColor}40`,
            marginBottom: '10px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
          }}>
            {categoryIcon} {categoryName}
          </span>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: DS.colors.text.dark, lineHeight: 1.3, marginBottom: '12px' }}>
            {content.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ color: DS.colors.text.secondary, fontSize: '14px' }}>👤 {creatorName}</span>
            {content.duration && <span style={{ color: DS.colors.text.secondary, fontSize: '14px' }}>⏱ {content.duration}</span>}
            <span style={{ color: DS.colors.text.secondary, fontSize: '14px' }}>
              📅 {new Date(content.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div style={{ borderTop: `1px solid ${DS.colors.neutral.light}`, marginBottom: '20px' }} />

          {content.description && (
            <p style={{ color: DS.colors.text.secondary, fontSize: '15px', lineHeight: 1.7 }}>
              {content.description}
            </p>
          )}

          {!user && (
            <div style={{
              marginTop: '24px', 
              backgroundColor: DS.colors.primary.main + '15',
              border: `1px solid ${DS.colors.primary.main}20`, 
              borderRadius: DS.borderRadius.lg, 
              padding: '20px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap', 
              gap: '12px',
            }}>
              <div>
                <div style={{ color: DS.colors.primary.main, fontWeight: '700', fontSize: '15px' }}>
                  🙏 Salve no histórico
                </div>
                <div style={{ color: DS.colors.text.secondary, fontSize: '13px', marginTop: '2px' }}>
                  Crie uma conta gratuita para salvar o progresso
                </div>
              </div>
              <a href="/auth/signup" style={{
                backgroundColor: DS.colors.primary.main, 
                color: 'white', 
                textDecoration: 'none',
                padding: '10px 20px', 
                borderRadius: DS.borderRadius.md, 
                fontSize: '14px', 
                fontWeight: '700',
              }}>
                Criar conta grátis
              </a>
            </div>
          )}
        </div>

        <RelatedSidebar currentId={contentId} categorySlug={categorySlug} />
      </div>
    </main>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function RelatedSidebar({
  currentId,
  categorySlug,
}: {
  currentId: string
  categorySlug?: string
}) {
  const [related, setRelated] = useState<Content[]>([])

  useEffect(() => {
    async function load() {
      const { data: catData } = categorySlug
        ? await supabase.from('categories').select('id').eq('slug', categorySlug).single()
        : { data: null }

      let query = supabase
        .from('contents')
        .select('id, title, duration, url_thumb, is_featured, category:categories(id, name, slug, color, icon, description, created_at)')
        .eq('status', 'approved')
        .neq('id', currentId)
        .limit(6)

      if (catData?.id) query = query.eq('category_id', catData.id)

      const { data } = await query
      setRelated((data as unknown as Content[]) ?? [])
    }
    load()
  }, [currentId, categorySlug])

  return (
    <aside>
      <h2 style={{
        color: DS.colors.text.secondary, 
        fontSize: '13px', 
        fontWeight: '700',
        marginBottom: '16px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px',
      }}>
        Mais conteúdo
      </h2>

      {related.length === 0 ? (
        <p style={{ color: DS.colors.text.secondary, fontSize: '13px' }}>Nenhum conteúdo relacionado ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {related.map(item => {
            const cat = getCategory(item.category)
            return (
              <a key={item.id} href={`/content/${item.id}`} style={{
                display: 'flex', 
                gap: '10px', 
                textDecoration: 'none',
                backgroundColor: DS.colors.bg.secondary, 
                borderRadius: DS.borderRadius.md, 
                padding: '10px',
                border: `1px solid ${DS.colors.neutral.light}`,
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.neutral.medium
                e.currentTarget.style.borderColor = DS.colors.primary.main
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                e.currentTarget.style.borderColor = DS.colors.neutral.light
              }}
              >
                <div style={{
                  width: '96px', 
                  height: '60px', 
                  flexShrink: 0,
                  backgroundColor: DS.colors.neutral.medium, 
                  borderRadius: DS.borderRadius.md,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '24px',
                  backgroundImage: item.url_thumb ? `url(${item.url_thumb})` : 'none',
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                }}>
                  {!item.url_thumb && (cat?.icon ?? '🎵')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: DS.colors.text.dark, 
                    fontSize: '13px', 
                    fontWeight: '600',
                    lineHeight: 1.3, 
                    marginBottom: '4px',
                    display: '-webkit-box', 
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ color: DS.colors.text.secondary, fontSize: '11px' }}>
                    {cat?.name}{item.duration && ` · ${item.duration}`}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </aside>
  )
}

// ── Skeletons ────────────────────────────────────────────────────────────────

function PlayerSkeleton() {
  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.lg, marginBottom: '20px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '28px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.md, width: '70%', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '16px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.md, width: '40%', animation: 'pulse 1.5s infinite' }} />
    </main>
  )
}

function NotFound() {
  return (
    <main style={{ maxWidth: '600px', margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>😔</div>
      <h1 style={{ color: DS.colors.text.dark, fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
        Conteúdo não encontrado
      </h1>
      <p style={{ color: DS.colors.text.secondary, fontSize: '15px', marginBottom: '24px' }}>
        Este conteúdo pode ter sido removido ou ainda não foi aprovado.
      </p>
      <a href="/" style={{
        backgroundColor: DS.colors.primary.main, 
        color: 'white', 
        textDecoration: 'none',
        padding: '12px 28px', 
        borderRadius: DS.borderRadius.md, 
        fontSize: '15px', 
        fontWeight: '700',
      }}>
        Voltar ao início
      </a>
    </main>
  )
}