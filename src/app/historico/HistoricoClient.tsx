// src/app/historico/HistoricoClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getWatchHistory } from '@/lib/db'

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
    category: {
      name: string
      slug: string
      color: string
      icon: string
    } | null
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
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>

      {/* Cabeçalho */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap',
        gap: '12px', marginBottom: '32px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A1A', marginBottom: '4px' }}>
            📺 Histórico
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>
            Conteúdos que você assistiu recentemente
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={handleClearAll} style={{
            backgroundColor: 'transparent', color: '#EF4444',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
            padding: '8px 16px', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer',
          }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {history.map(item => {
            if (!item.content) return null
            const color = item.content.category?.color ?? '#B8860B'
            const watchedAt = new Date(item.watched_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            })

            return (
              <div key={item.id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                padding: '16px', display: 'flex', gap: '16px',
                alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}>
                {/* Thumb */}
                <a href={`/content/${item.content.id}`} style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '120px', height: '72px', borderRadius: '10px',
                    backgroundColor: '#1A1A1A', overflow: 'hidden',
                    backgroundImage: item.content.url_thumb ? `url(${item.content.url_thumb})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', position: 'relative',
                  }}>
                    {!item.content.url_thumb && (item.content.category?.icon ?? '🎵')}
                    {/* Badge completado */}
                    {item.completed && (
                      <div style={{
                        position: 'absolute', bottom: '4px', right: '4px',
                        backgroundColor: '#4CAF50', borderRadius: '9999px',
                        width: '18px', height: '18px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '10px',
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </a>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', color,
                    backgroundColor: `${color}15`, padding: '2px 8px',
                    borderRadius: '9999px', display: 'inline-block', marginBottom: '6px',
                  }}>
                    {item.content.category?.icon} {item.content.category?.name}
                  </span>
                  <a href={`/content/${item.content.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                      fontSize: '15px', fontWeight: '700', color: '#1A1A1A',
                      marginBottom: '4px', lineHeight: 1.3,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {item.content.title}
                    </h3>
                  </a>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#999', fontSize: '12px' }}>🕐 {watchedAt}</span>
                    {item.content.duration && (
                      <span style={{ color: '#999', fontSize: '12px' }}>⏱ {item.content.duration}</span>
                    )}
                    {item.completed && (
                      <span style={{ color: '#4CAF50', fontSize: '12px', fontWeight: '600' }}>✅ Concluído</span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <a href={`/content/${item.content.id}`} style={{
                    backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
                    padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
                    fontWeight: '600', whiteSpace: 'nowrap',
                  }}>
                    ▶ Assistir
                  </a>
                  <button onClick={() => handleRemove(item.id)} style={{
                    backgroundColor: 'transparent', color: '#999',
                    border: '1px solid #E0E0E0', borderRadius: '8px',
                    padding: '8px 14px', fontSize: '13px', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          backgroundColor: 'white', borderRadius: '16px', padding: '16px',
          display: 'flex', gap: '16px', animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ width: '120px', height: '72px', backgroundColor: '#F0F0F0', borderRadius: '10px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '12px', backgroundColor: '#F0F0F0', borderRadius: '4px', width: '60px', marginBottom: '8px' }} />
            <div style={{ height: '16px', backgroundColor: '#F0F0F0', borderRadius: '4px', width: '80%', marginBottom: '6px' }} />
            <div style={{ height: '12px', backgroundColor: '#F0F0F0', borderRadius: '4px', width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Empty() {
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '20px', padding: '64px 32px',
      textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>
        Nenhum conteúdo assistido ainda
      </h2>
      <p style={{ color: '#999', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
        Quando você assistir pregações, louvores ou devocionais,<br />
        eles aparecerão aqui.
      </p>
      <a href="/" style={{
        backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
        padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
      }}>
        🎵 Explorar Conteúdo
      </a>
    </div>
  )
}