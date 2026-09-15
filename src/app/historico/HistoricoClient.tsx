'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getWatchHistory } from '@/lib/db'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

const SUCCESS_COLOR = '#6B7F6B'
const ERROR_COLOR   = '#C84C3C'

interface HistoryItem {
  id: string
  watched_at: string
  progress_sec: number
  completed: boolean
  content: {
    id: string
    title: string
    duration: string | null
    url_thumb: string | null
    category: { name: string; slug: string; color: string; icon: string } | null
  } | null
}

export default function HistoricoClient() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login?redirect=/historico'); return }
      const { data } = await getWatchHistory(user.id)
      setHistory((data as unknown as HistoryItem[]) ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleRemove(id: string) {
    await supabase.from('watch_history').delete().eq('id', id)
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  async function handleClearAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('watch_history').delete().eq('user_id', user.id)
    setHistory([])
  }

  return (
    <main style={{
      maxWidth: '900px', margin: '0 auto', padding: '40px 16px',
      backgroundColor: DS.colors.bg.primary, minHeight: '100vh',
    }}>
      {/* Cabeçalho */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap' as const,
        gap: '12px', marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: DS.typography.fontSize['5xl'],
            fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.primary,
            marginBottom: '4px', letterSpacing: '-0.5px',
          }}>
            📺 Histórico
          </h1>
          <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '15px' }}>
            Conteúdos que você assistiu recentemente
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              backgroundColor: 'transparent', color: ERROR_COLOR,
              border: `1.5px solid ${ERROR_COLOR}35`,
              borderRadius: DS.borderRadius.lg, padding: '8px 16px',
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold,
              cursor: 'pointer', transition: DS.transitions.fast,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${ERROR_COLOR}12`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            🗑️ Limpar histórico
          </button>
        )}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <Skeleton />
      ) : history.length === 0 ? (
        <Empty />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {history.map(item => {
            if (!item.content) return null
            const color = item.content.category?.color ?? DS.colors.primary.main
            const watchedAt = new Date(item.watched_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            })

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: DS.colors.bg.secondary,
                  borderRadius: DS.borderRadius.lg, padding: '16px',
                  display: 'flex', gap: '16px', alignItems: 'center',
                  boxShadow: DS.shadows.sm,
                  border: `1px solid ${DS.colors.neutral.light}`,
                  transition: DS.transitions.fast,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${DS.colors.primary.main}44`
                  el.style.boxShadow = DS.shadows.md
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = DS.colors.neutral.light
                  el.style.boxShadow = DS.shadows.sm
                }}
              >
                {/* Thumb */}
                <a href={`/content/${item.content.id}`} style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '120px', height: '72px',
                    borderRadius: DS.borderRadius.md,
                    backgroundColor: DS.colors.neutral.light, overflow: 'hidden',
                    backgroundImage: item.content.url_thumb ? `url(${item.content.url_thumb})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', position: 'relative' as const,
                  }}>
                    {!item.content.url_thumb && (item.content.category?.icon ?? '🎵')}
                    {item.completed && (
                      <div style={{
                        position: 'absolute', bottom: '4px', right: '4px',
                        backgroundColor: SUCCESS_COLOR, borderRadius: DS.borderRadius.full,
                        width: '18px', height: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', color: '#FFFFFF',
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </a>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '11px', fontWeight: DS.typography.fontWeight.semibold,
                    color, backgroundColor: `${color}20`,
                    padding: '2px 8px', borderRadius: DS.borderRadius.full,
                    display: 'inline-block', marginBottom: '6px',
                  }}>
                    {item.content.category?.icon} {item.content.category?.name}
                  </span>

                  <a href={`/content/${item.content.id}`} style={{ textDecoration: 'none' }}>
                    <h3
                      style={{
                        fontFamily: DS.typography.fontFamily.heading,
                        fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
                        color: DS.colors.text.primary,
                        marginBottom: '4px', lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                        transition: DS.transitions.fast,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = DS.colors.primary.main)}
                      onMouseLeave={e => (e.currentTarget.style.color = DS.colors.text.primary)}
                    >
                      {item.content.title}
                    </h3>
                  </a>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px' }}>
                      🕐 {watchedAt}
                    </span>
                    {item.content.duration && (
                      <span style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px' }}>
                        ⏱ {item.content.duration}
                      </span>
                    )}
                    {item.completed && (
                      <span style={{ fontFamily: DS.typography.fontFamily.body, color: SUCCESS_COLOR, fontSize: '12px', fontWeight: DS.typography.fontWeight.semibold }}>
                        ✅ Concluído
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', flexShrink: 0 }}>
                  <a
                    href={`/content/${item.content.id}`}
                    style={{
                      backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
                      textDecoration: 'none', padding: '8px 14px',
                      borderRadius: DS.borderRadius.md,
                      fontFamily: DS.typography.fontFamily.body,
                      fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold,
                      whiteSpace: 'nowrap' as const, transition: DS.transitions.fast,
                      display: 'inline-block',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
                  >
                    ▶ Assistir
                  </a>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{
                      backgroundColor: 'transparent',
                      color: DS.colors.text.secondary,
                      border: `1.5px solid ${DS.colors.neutral.medium}`,
                      borderRadius: DS.borderRadius.md, padding: '8px 14px',
                      fontFamily: DS.typography.fontFamily.body,
                      fontSize: '13px', cursor: 'pointer',
                      whiteSpace: 'nowrap' as const, transition: DS.transitions.fast,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = ERROR_COLOR
                      e.currentTarget.style.color = ERROR_COLOR
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = DS.colors.neutral.medium
                      e.currentTarget.style.color = DS.colors.text.secondary
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          backgroundColor: DS.colors.bg.secondary,
          borderRadius: DS.borderRadius.lg, padding: '16px',
          display: 'flex', gap: '16px',
          animation: 'pulse 1.5s infinite',
          border: `1px solid ${DS.colors.neutral.light}`,
        }}>
          <div style={{ width: '120px', height: '72px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.md, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '12px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, width: '60px', marginBottom: '8px' }} />
            <div style={{ height: '16px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, width: '80%', marginBottom: '6px' }} />
            <div style={{ height: '12px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.sm, width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Empty() {
  return (
    <div style={{
      backgroundColor: DS.colors.bg.secondary, borderRadius: DS.borderRadius.xl,
      padding: '64px 32px', textAlign: 'center',
      boxShadow: DS.shadows.sm, border: `1px solid ${DS.colors.neutral.light}`,
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
      <h2 style={{
        fontFamily: DS.typography.fontFamily.heading,
        fontSize: DS.typography.fontSize['3xl'],
        fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.text.primary, marginBottom: '8px',
      }}>
        Nenhum conteúdo assistido ainda
      </h2>
      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary, fontSize: '15px',
        marginBottom: '28px', lineHeight: 1.6,
      }}>
        Quando você assistir pregações, louvores ou devocionais,<br />
        eles aparecerão aqui.
      </p>
      <a
        href="/"
        style={{
          backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
          textDecoration: 'none', padding: '12px 28px',
          borderRadius: DS.borderRadius.lg, fontFamily: DS.typography.fontFamily.body,
          fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
          display: 'inline-block', transition: DS.transitions.fast,
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
      >
        🎵 Explorar Conteúdo
      </a>
    </div>
  )
}