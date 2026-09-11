// src/app/playlist/PlaylistClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Playlist } from '@/types'

export default function PlaylistClient() {
  const router = useRouter()
  const [playlists, setPlaylists]   = useState<Playlist[]>([])
  const [loading, setLoading]       = useState(true)
  const [userId, setUserId]         = useState<string | null>(null)
  const [showModal, setShowModal]   = useState(false)
  const [editItem, setEditItem]     = useState<Playlist | null>(null)
  const [formTitle, setFormTitle]   = useState('')
  const [formDesc, setFormDesc]     = useState('')
  const [formPublic, setFormPublic] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [deleteId, setDeleteId]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login?redirect=/playlist'); return }
      setUserId(user.id)
      await loadPlaylists(user.id)
    }
    load()
  }, [router])

  async function loadPlaylists(uid: string) {
    setLoading(true)
    const { data } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setPlaylists((data as Playlist[]) ?? [])
    setLoading(false)
  }

  function openCreate() {
    setEditItem(null)
    setFormTitle('')
    setFormDesc('')
    setFormPublic(false)
    setShowModal(true)
  }

  function openEdit(pl: Playlist) {
    setEditItem(pl)
    setFormTitle(pl.title)
    setFormDesc(pl.description ?? '')
    setFormPublic(pl.public)
    setShowModal(true)
  }

  async function handleSave() {
    if (!formTitle.trim() || !userId) return
    setSaving(true)

    if (editItem) {
      // Editar
      const { data } = await supabase
        .from('playlists')
        .update({
          title:       formTitle.trim(),
          description: formDesc.trim() || null,
          public:      formPublic,
          updated_at:  new Date().toISOString(),
        })
        .eq('id', editItem.id)
        .select()
        .single()

      if (data) {
        setPlaylists(prev => prev.map(p => p.id === editItem.id ? data as Playlist : p))
      }
    } else {
      // Criar
      const { data } = await supabase
        .from('playlists')
        .insert({
          user_id:     userId,
          title:       formTitle.trim(),
          description: formDesc.trim() || null,
          public:      formPublic,
        })
        .select()
        .single()

      if (data) {
        setPlaylists(prev => [data as Playlist, ...prev])
      }
    }

    setSaving(false)
    setShowModal(false)
  }

  async function handleDelete(id: string) {
    setDeleteId(id)
    await supabase.from('playlists').delete().eq('id', id)
    setPlaylists(prev => prev.filter(p => p.id !== id))
    setDeleteId(null)
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
            🎵 Minhas Playlists
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>Organize seu conteúdo favorito</p>
        </div>
        <button onClick={openCreate} style={{
          backgroundColor: '#B8860B', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
          fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}>
          + Nova Playlist
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <Skeleton />
      ) : playlists.length === 0 ? (
        <Empty onCreate={openCreate} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {playlists.map(pl => (
            <div key={pl.id} style={{
              backgroundColor: 'white', borderRadius: '16px',
              padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              {/* Ícone */}
              <div style={{
                width: '48px', height: '48px', backgroundColor: 'rgba(184,134,11,0.1)',
                borderRadius: '12px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '24px',
              }}>
                🎵
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>
                  {pl.title}
                </h3>
                {pl.description && (
                  <p style={{
                    fontSize: '13px', color: '#666', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {pl.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', color: '#999',
                    backgroundColor: '#F5F5F5', padding: '3px 8px', borderRadius: '9999px',
                  }}>
                    {new Date(pl.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {pl.public && (
                    <span style={{
                      fontSize: '11px', color: '#4CAF50',
                      backgroundColor: 'rgba(76,175,80,0.1)', padding: '3px 8px',
                      borderRadius: '9999px', fontWeight: '600',
                    }}>
                      🌐 Pública
                    </span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(pl)} style={{
                  flex: 1, backgroundColor: '#F5F5F5', color: '#1A1A1A',
                  border: 'none', borderRadius: '8px', padding: '8px',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(pl.id)}
                  disabled={deleteId === pl.id}
                  style={{
                    backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
                    padding: '8px 12px', fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  {deleteId === pl.id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal criar/editar */}
      {showModal && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300 }}
            onClick={() => setShowModal(false)}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', borderRadius: '20px',
            padding: '32px', width: '100%', maxWidth: '440px',
            zIndex: 301, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A1A', marginBottom: '20px' }}>
              {editItem ? '✏️ Editar Playlist' : '🎵 Nova Playlist'}
            </h2>

            {/* Título */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nome da playlist *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Louvores da Manhã"
                autoFocus
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#B8860B')}
                onBlur={(e)  => (e.target.style.borderColor = '#E0E0E0')}
              />
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Descrição</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Opcional..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={(e) => (e.target.style.borderColor = '#B8860B')}
                onBlur={(e)  => (e.target.style.borderColor = '#E0E0E0')}
              />
            </div>

            {/* Pública */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', marginBottom: '24px',
            }}>
              <input
                type="checkbox"
                checked={formPublic}
                onChange={(e) => setFormPublic(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#B8860B' }}
              />
              <span style={{ fontSize: '14px', color: '#333' }}>
                🌐 Tornar pública (qualquer pessoa pode ver)
              </span>
            </label>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, backgroundColor: '#F5F5F5', color: '#666',
                border: 'none', borderRadius: '10px', padding: '12px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formTitle.trim()}
                style={{
                  flex: 1, backgroundColor: !formTitle.trim() ? '#D4AF37' : '#B8860B',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '12px', fontSize: '14px', fontWeight: '700',
                  cursor: saving || !formTitle.trim() ? 'not-allowed' : 'pointer',
                  opacity: !formTitle.trim() ? 0.6 : 1,
                }}
              >
                {saving ? 'Salvando...' : editItem ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

// ── Sub-componentes ──────────────────────────────────────────

function Empty({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '20px', padding: '64px 32px',
      textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎶</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>
        Nenhuma playlist criada ainda
      </h2>
      <p style={{ color: '#999', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
        Crie playlists personalizadas com pregações,<br />louvores e devocionais.
      </p>
      <button onClick={onCreate} style={{
        backgroundColor: '#B8860B', color: 'white', border: 'none',
        padding: '12px 28px', borderRadius: '10px', fontSize: '15px',
        fontWeight: '700', cursor: 'pointer',
      }}>
        + Criar primeira playlist
      </button>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          backgroundColor: 'white', borderRadius: '16px', padding: '20px',
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#F0F0F0', borderRadius: '12px', marginBottom: '12px' }} />
          <div style={{ height: '18px', backgroundColor: '#F0F0F0', borderRadius: '4px', width: '70%', marginBottom: '8px' }} />
          <div style={{ height: '14px', backgroundColor: '#F0F0F0', borderRadius: '4px', width: '90%' }} />
        </div>
      ))}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#333', fontSize: '13px',
  fontWeight: '600', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: 'white', border: '1.5px solid #E0E0E0',
  borderRadius: '10px', padding: '12px 16px', color: '#1A1A1A', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}