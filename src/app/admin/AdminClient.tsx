// src/app/admin/AdminClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Content } from '@/types'

type Tab = 'pending' | 'approved' | 'rejected'

export default function AdminClient() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [contents, setContents]     = useState<Content[]>([])
  const [tab, setTab]               = useState<Tab>('pending')
  const [loading, setLoading]       = useState(true)
  const [actionId, setActionId]     = useState<string | null>(null)

  // Verifica se é moderador/admin
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['moderator', 'admin'].includes(profile.role)) {
        router.push('/')
        return
      }
      setAuthorized(true)
      loadContents('pending')
    }
    checkAuth()
  }, [router])

  async function loadContents(status: Tab) {
    setLoading(true)
    const { data } = await supabase
      .from('contents')
      .select(`*, category:categories(name, slug, color, icon), creator:profiles(full_name)`)
      .eq('status', status)
      .order('created_at', { ascending: false })

    setContents((data as Content[]) ?? [])
    setLoading(false)
  }

  async function handleAction(id: string, action: 'approved' | 'rejected') {
    setActionId(id)
    await supabase.from('contents').update({ status: action }).eq('id', id)
    setContents(prev => prev.filter(c => c.id !== id))
    setActionId(null)
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    await supabase.from('contents').update({ is_featured: !current }).eq('id', id)
    setContents(prev => prev.map(c => c.id === id ? { ...c, is_featured: !current } : c))
  }

  if (!authorized) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#666' }}>
      Verificando permissões...
    </div>
  )

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>

      {/* Título */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
          🛡️ Painel de Curadoria
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Aprove, rejeite e gerencie conteúdos da plataforma
        </p>
      </div>
      <a href="/admin/upload" style={{
    backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
    padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
  }}>
    📤 Novo Upload
  </a>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {([
          { key: 'pending',  label: '⏳ Pendentes'  },
          { key: 'approved', label: '✅ Aprovados'  },
          { key: 'rejected', label: '❌ Rejeitados' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); loadContents(t.key) }}
            style={{
              padding: '8px 18px', borderRadius: '9999px', border: 'none',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              backgroundColor: tab === t.key ? '#B8860B' : '#2D2D2D',
              color: tab === t.key ? 'white' : '#999',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Carregando...</div>
      ) : contents.length === 0 ? (
        <div style={{
          backgroundColor: '#222', borderRadius: '16px', padding: '48px',
          textAlign: 'center', color: '#555',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>
            {tab === 'pending' ? '🎉' : tab === 'approved' ? '📭' : '🗑️'}
          </div>
          <p>Nenhum conteúdo {tab === 'pending' ? 'aguardando aprovação' : tab === 'approved' ? 'aprovado ainda' : 'rejeitado'}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {contents.map(item => (
            <div key={item.id} style={{
              backgroundColor: '#222', borderRadius: '14px', padding: '20px',
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              border: '1px solid #2D2D2D',
            }}>
              {/* Thumb */}
              <div style={{
                width: '100px', height: '64px', flexShrink: 0,
                backgroundColor: '#1A1A1A', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                backgroundImage: item.url_thumb ? `url(${item.url_thumb})` : 'none',
                backgroundSize: 'cover',
              }}>
                {!item.url_thumb && (item.category?.icon ?? '🎵')}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600',
                    color: item.category?.color ?? '#B8860B',
                    backgroundColor: `${item.category?.color ?? '#B8860B'}20`,
                    padding: '2px 8px', borderRadius: '9999px',
                  }}>
                    {item.category?.icon} {item.category?.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#555' }}>
                    {item.type.toUpperCase()}
                  </span>
                  {item.is_featured && (
                    <span style={{
                      fontSize: '11px', fontWeight: '600',
                      color: '#B8860B', backgroundColor: 'rgba(184,134,11,0.1)',
                      padding: '2px 8px', borderRadius: '9999px',
                    }}>
                      ✨ Destaque
                    </span>
                  )}
                </div>

                <h3 style={{ color: '#FFF', fontSize: '15px', fontWeight: '700', marginBottom: '4px', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                {item.description && (
                  <p style={{
                    color: '#666', fontSize: '13px', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {item.description}
                  </p>
                )}

                <div style={{ color: '#555', fontSize: '12px', marginTop: '6px' }}>
                  Por {item.creator?.full_name ?? 'Desconhecido'} ·{' '}
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  {item.duration && ` · ${item.duration}`}
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                {tab === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      disabled={actionId === item.id}
                      style={{
                        backgroundColor: '#4CAF50', color: 'white', border: 'none',
                        borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      ✅ Aprovar
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'rejected')}
                      disabled={actionId === item.id}
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      ❌ Rejeitar
                    </button>
                  </>
                )}

                {tab === 'approved' && (
                  <button
                    onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                    style={{
                      backgroundColor: item.is_featured ? 'rgba(184,134,11,0.2)' : '#2D2D2D',
                      color: item.is_featured ? '#B8860B' : '#999',
                      border: `1px solid ${item.is_featured ? 'rgba(184,134,11,0.4)' : '#3D3D3D'}`,
                      borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                      fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    {item.is_featured ? '✨ Destaque' : '☆ Destacar'}
                  </button>
                )}

                {tab === 'rejected' && (
                  <button
                    onClick={() => handleAction(item.id, 'approved')}
                    style={{
                      backgroundColor: '#2D2D2D', color: '#999', border: '1px solid #3D3D3D',
                      borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                      fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    ↩️ Restaurar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}