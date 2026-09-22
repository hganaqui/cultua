// ✅ ContentPlayer.tsx (SEM PLYR - USANDO VIDEO NATIVO + FALLBACK)
// Caminho: app/components/ContentPlayer.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getContentById, incrementViewCount, saveWatchHistory } from '@/lib/db'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content } from '@/types'
import { getCategory, getContentTags } from '@/types'
import type { User } from '@supabase/supabase-js'

const DS = DESIGN_SYSTEM

export default function ContentPlayer({
  contentId,
}: {
  contentId: string
}) {
  const [content, setContent] = useState<Content | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [isSharing, setIsSharing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const viewCounted = useRef(false)

  // ✅ 1. Carregar conteúdo e usuário
  useEffect(() => {
    async function load() {
      try {
        const [
          { data: contentData },
          { data: { user: currentUser } },
        ] = await Promise.all([
          getContentById(contentId),
          supabase.auth.getUser(),
        ])

        if (!contentData) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setContent(contentData)
        setUser(currentUser)
        setViewCount(contentData.view_count || 0)
        setLoading(false)

        // ✅ Verificar se é favorito
        if (currentUser) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('content_id', contentId)
            .single()
          setIsFavorited(!!favData)
        }

        // ✅ Incrementar visualizações (apenas uma vez)
        if (!viewCounted.current) {
          viewCounted.current = true
          await incrementViewCount(contentId)
          setViewCount((contentData.view_count || 0) + 1)
        }
      } catch (err) {
        console.error('[ContentPlayer] Erro ao carregar:', err)
        setNotFound(true)
        setLoading(false)
      }
    }
    load()
  }, [contentId])

  // ✅ 2. Salvar progresso periodicamente
  useEffect(() => {
    if (!user || !content || !videoRef.current) return

    const handleTimeUpdate = () => {
      const currentTime = videoRef.current?.currentTime || 0
      const duration = videoRef.current?.duration || 1
      const progress = Math.round((currentTime / duration) * 100)

      // Salvar a cada 10 segundos
      if (Math.round(currentTime) % 10 === 0) {
        saveWatchHistory(user.id, contentId, Math.round(currentTime), false)
      }

      // Marcar como assistido quando chegar a 90%
      if (progress >= 90) {
        saveWatchHistory(user.id, contentId, Math.round(currentTime), true)
      }
    }

    const video = videoRef.current
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [user, contentId])

  // ✅ 3. Restaurar progresso ao carregar
  useEffect(() => {
    if (!user || !videoRef.current) return

    async function restoreProgress() {
      try {
        const { data: historyData } = await supabase
          .from('watch_history')
          .select('progress_seconds')
          .eq('user_id', user?.id)
          .eq('content_id', contentId)
          .order('watched_at', { ascending: false })
          .limit(1)
          .single()

        if (historyData && videoRef.current) {
          videoRef.current.currentTime = historyData.progress_seconds
        }
      } catch (err) {
        console.error('[ContentPlayer] Erro ao restaurar progresso:', err)
      }
    }

    restoreProgress()
  }, [user, contentId])

  // ✅ 4. Favoritar/desfavoritar
  async function toggleFavorite() {
    if (!user || !content) return

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId)
        setIsFavorited(false)
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          content_id: contentId,
        })
        setIsFavorited(true)
      }
    } catch (err) {
      console.error('[ContentPlayer] Erro ao favoritar:', err)
    }
  }

  // ✅ 5. Compartilhar
  async function shareContent() {
    const url = window.location.href
    const text = `Veja "${content?.title}" em CULTUA - Conteúdo para edificar sua fé`

    if (navigator.share) {
      try {
        await navigator.share({
          title: content?.title,
          text,
          url,
        })
      } catch (err) {
        console.error('[ContentPlayer] Erro ao compartilhar:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copiado para a área de transferência!')
      } catch (err) {
        console.error('[ContentPlayer] Erro ao copiar link:', err)
      }
    }
    setIsSharing(false)
  }

  if (loading) return <PlayerSkeleton />
  if (notFound) return <NotFound />
  if (!content) return null

  const cat = getCategory(content.category)
  const categoryColor = cat?.color ?? DS.colors.primary.main
  const categoryIcon = cat?.icon ?? '🎵'
  const categoryName = cat?.name ?? ''
  const creatorName = (content.creator as any)?.full_name ?? 'CULTUA'

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <style>{`
        .player-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
        @media (max-width: 900px) { .player-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="player-grid">
        {/* ✅ PLAYER PRINCIPAL (VIDEO NATIVO) */}
        <div>
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: '#000',
              borderRadius: DS.borderRadius.lg,
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            {content.url_media ? (
              <video
                ref={videoRef}
                controls
                crossOrigin="anonymous"
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              >
                <source src={content.url_media} type="video/mp4" />
                Seu navegador não suporta este vídeo.
              </video>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: DS.colors.text.secondary,
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '12px' }}>
                  {categoryIcon}
                </div>
                <p
                  style={{
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px',
                  }}
                >
                  Mídia em breve
                </p>
              </div>
            )}
          </div>

          {/* ✅ BADGE CATEGORIA */}
          <span
            style={{
              display: 'inline-block',
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '12px',
              fontWeight: DS.typography.fontWeight.semibold,
              padding: '4px 12px',
              borderRadius: DS.borderRadius.full,
              border: `1px solid ${categoryColor}40`,
              marginBottom: '10px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px',
            }}
          >
            {categoryIcon} {categoryName}
          </span>

          {/* ✅ TÍTULO */}
          <h1
            style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: '28px',
              fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.text.primary,
              lineHeight: 1.3,
              marginBottom: '12px',
            }}
          >
            {content.title}
          </h1>

          {/* ✅ META */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap' as const,
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '14px',
              }}
            >
              👤 {creatorName}
            </span>
            {content.duration && (
              <span
                style={{
                  fontFamily: DS.typography.fontFamily.body,
                  color: DS.colors.text.secondary,
                  fontSize: '14px',
                }}
              >
                ⏱ {content.duration}
              </span>
            )}
            <span
              style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '14px',
              }}
            >
              📅{' '}
              {new Date(content.created_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span
              style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '14px',
              }}
            >
              👁 {viewCount.toLocaleString('pt-BR')} visualizações
            </span>
          </div>

          {/* ✅ AÇÕES */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap' as const,
              marginBottom: '20px',
            }}
          >
            {user ? (
              <>
                <button
                  onClick={toggleFavorite}
                  style={{
                    backgroundColor: isFavorited
                      ? DS.colors.primary.main
                      : DS.colors.bg.secondary,
                    color: isFavorited
                      ? '#FFFFFF'
                      : DS.colors.text.secondary,
                    border: `1.5px solid ${
                      isFavorited
                        ? DS.colors.primary.main
                        : DS.colors.neutral.medium
                    }`,
                    padding: '10px 16px',
                    borderRadius: DS.borderRadius.lg,
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px',
                    fontWeight: DS.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: DS.transitions.fast,
                  }}
                  onMouseEnter={(e) => {
                    if (!isFavorited) {
                      e.currentTarget.style.borderColor =
                        DS.colors.primary.main
                      e.currentTarget.style.backgroundColor =
                        DS.colors.neutral.light
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isFavorited) {
                      e.currentTarget.style.borderColor =
                        DS.colors.neutral.medium
                      e.currentTarget.style.backgroundColor =
                        DS.colors.bg.secondary
                    }
                  }}
                >
                  {isFavorited ? '❤️ Desfavoritar' : '🤍 Favoritar'}
                </button>

                <button
                  onClick={() => setIsSharing(!isSharing)}
                  style={{
                    backgroundColor: DS.colors.bg.secondary,
                    color: DS.colors.text.secondary,
                    border: `1.5px solid ${DS.colors.neutral.medium}`,
                    padding: '10px 16px',
                    borderRadius: DS.borderRadius.lg,
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px',
                    fontWeight: DS.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: DS.transitions.fast,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      DS.colors.primary.main
                    e.currentTarget.style.backgroundColor =
                      DS.colors.neutral.light
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      DS.colors.neutral.medium
                    e.currentTarget.style.backgroundColor =
                      DS.colors.bg.secondary
                  }}
                >
                  📤 Compartilhar
                </button>

                {isSharing && (
                  <button
                    onClick={shareContent}
                    style={{
                      backgroundColor: DS.colors.primary.main,
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: DS.borderRadius.lg,
                      fontFamily: DS.typography.fontFamily.body,
                      fontSize: '14px',
                      fontWeight: DS.typography.fontWeight.semibold,
                      cursor: 'pointer',
                    }}
                  >
                    Enviar via...
                  </button>
                )}

                <button
                  style={{
                    backgroundColor: DS.colors.bg.secondary,
                    color: DS.colors.text.secondary,
                    border: `1.5px solid ${DS.colors.neutral.medium}`,
                    padding: '10px 16px',
                    borderRadius: DS.borderRadius.lg,
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px',
                    fontWeight: DS.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: DS.transitions.fast,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      DS.colors.primary.main
                    e.currentTarget.style.backgroundColor =
                      DS.colors.neutral.light
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      DS.colors.neutral.medium
                    e.currentTarget.style.backgroundColor =
                      DS.colors.bg.secondary
                  }}
                >
                  ➕ Adicionar à Playlist
                </button>
              </>
            ) : (
              <div
                style={{
                  backgroundColor: `${DS.colors.primary.main}12`,
                  border: `1px solid ${DS.colors.primary.main}20`,
                  borderRadius: DS.borderRadius.lg,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: DS.typography.fontFamily.body,
                    color: DS.colors.primary.main,
                    fontSize: '14px',
                    fontWeight: DS.typography.fontWeight.semibold,
                  }}
                >
                  🔐 Faça login para favoritar e compartilhar
                </span>
                <a
                  href="/auth/login"
                  style={{
                    backgroundColor: DS.colors.primary.main,
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    padding: '6px 14px',
                    borderRadius: DS.borderRadius.md,
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '12px',
                    fontWeight: DS.typography.fontWeight.semibold,
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  Entrar
                </a>
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: `1px solid ${DS.colors.neutral.light}`,
              marginBottom: '20px',
            }}
          />

          {/* ✅ DESCRIÇÃO */}
          {content.description && (
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontFamily: DS.typography.fontFamily.heading,
                  fontSize: '16px',
                  fontWeight: DS.typography.fontWeight.semibold,
                  color: DS.colors.text.primary,
                  marginBottom: '12px',
                }}
              >
                Sobre este conteúdo
              </h2>
              <p
                style={{
                  fontFamily: DS.typography.fontFamily.body,
                  color: DS.colors.text.secondary,
                  fontSize: '15px',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap' as const,
                }}
              >
                {content.description}
              </p>
            </div>
          )}
        </div>

        {/* ✅ SIDEBAR DE CONTEÚDO RELACIONADO */}
        <RelatedSidebar currentId={contentId} categoryId={content.category_id} />
      </div>
    </main>
  )
}

function RelatedSidebar({
  currentId,
  categoryId,
}: {
  currentId: string
  categoryId: string | null
}) {
  const [related, setRelated] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (!categoryId) {
          setRelated([])
          setLoading(false)
          return
        }

        const { data } = await supabase
          .from('contents')
          .select(
            'id, title, duration, url_thumb, created_at, category:categories(id, name, slug, color, icon)'
          )
          .eq('status', 'published')
          .eq('category_id', categoryId)
          .neq('id', currentId)
          .order('created_at', { ascending: false })
          .limit(6)

        setRelated((data as unknown as Content[]) ?? [])
      } catch (err) {
        console.error('[RelatedSidebar] Erro ao carregar:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentId, categoryId])

  if (loading) {
    return (
      <aside>
        <div
          style={{
            height: '200px',
            backgroundColor: DS.colors.neutral.medium,
            borderRadius: DS.borderRadius.lg,
            animation: 'pulse 1.5s infinite',
          }}
        />
      </aside>
    )
  }

  return (
    <aside>
      <h2
        style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontSize: '13px',
          fontWeight: DS.typography.fontWeight.bold,
          marginBottom: '16px',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
        }}
      >
        📺 Mais conteúdo
      </h2>

      {related.length === 0 ? (
        <p
          style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary,
            fontSize: '13px',
          }}
        >
          Nenhum conteúdo relacionado ainda.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '10px',
          }}
        >
          {related.map(item => {
            const cat = getCategory(item.category)
            return (
              <a
                key={item.id}
                href={`/content/${item.id}`}
                style={{
                  display: 'flex',
                  gap: '10px',
                  textDecoration: 'none',
                  backgroundColor: DS.colors.bg.secondary,
                  borderRadius: DS.borderRadius.md,
                  padding: '10px',
                  border: `1px solid ${DS.colors.neutral.light}`,
                  transition: DS.transitions.fast,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.backgroundColor =
                    DS.colors.neutral.light
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.neutral.light
                  e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                }}
              >
                <div
                  style={{
                    width: '96px',
                    height: '60px',
                    flexShrink: 0,
                    backgroundColor: DS.colors.neutral.light,
                    borderRadius: DS.borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    backgroundImage: item.url_thumb
                      ? `url(${item.url_thumb})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {!item.url_thumb && (cat?.icon ?? '🎵')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: DS.typography.fontFamily.heading,
                      color: DS.colors.text.primary,
                      fontSize: '13px',
                      fontWeight: DS.typography.fontWeight.semibold,
                      lineHeight: 1.3,
                      marginBottom: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: DS.typography.fontFamily.body,
                      color: DS.colors.text.secondary,
                      fontSize: '11px',
                    }}
                  >
                    {cat?.name}
                    {item.duration && ` · ${item.duration}`}
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

function PlayerSkeleton() {
  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: DS.colors.neutral.medium,
          borderRadius: DS.borderRadius.lg,
          marginBottom: '20px',
          animation: 'pulse 1.5s infinite',
        }}
      />
      <div
        style={{
          height: '28px',
          backgroundColor: DS.colors.neutral.medium,
          borderRadius: DS.borderRadius.md,
          width: '70%',
          marginBottom: '12px',
          animation: 'pulse 1.5s infinite',
        }}
      />
      <div
        style={{
          height: '16px',
          backgroundColor: DS.colors.neutral.medium,
          borderRadius: DS.borderRadius.md,
          width: '40%',
          animation: 'pulse 1.5s infinite',
        }}
      />
    </main>
  )
}

function NotFound() {
  return (
    <main
      style={{
        maxWidth: '600px',
        margin: '80px auto',
        padding: '0 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>😔</div>
      <h1
        style={{
          fontFamily: DS.typography.fontFamily.heading,
          color: DS.colors.text.primary,
          fontSize: '24px',
          fontWeight: DS.typography.fontWeight.bold,
          marginBottom: '8px',
        }}
      >
        Conteúdo não encontrado
      </h1>
      <p
        style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontSize: '15px',
          marginBottom: '24px',
        }}
      >
        Este conteúdo pode ter sido removido ou ainda não foi aprovado.
      </p>
      <a
        href="/"
        style={{
          backgroundColor: DS.colors.primary.main,
          color: '#FFFFFF',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: DS.borderRadius.lg,
          fontFamily: DS.typography.fontFamily.body,
          fontSize: '15px',
          fontWeight: DS.typography.fontWeight.semibold,
        }}
      >
        Voltar ao início
      </a>
    </main>
  )
}