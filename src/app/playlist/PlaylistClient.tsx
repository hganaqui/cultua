'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Playlist } from '@/types'

const DS = DESIGN_SYSTEM

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
    <main style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '40px 16px',
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary
    }}>

      {/* Cabeçalho */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start', 
        flexWrap: 'wrap',
        gap: '12px', 
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: DS.colors.text.dark, marginBottom: '4px' }}>
            🎵 Minhas Playlists
          </h1>
          <p style={{ color: DS.colors.text.secondary, fontSize: '15px' }}>
            Organize seu conteúdo favorito
          </p>
        </div>
        <button onClick={openCreate} style={{
          backgroundColor: DS.colors.primary.main, 
          color: 'white', 
          border: 'none',
          padding: '10px 20px', 
          borderRadius: DS.borderRadius.md, 
          fontSize: '14px',
          fontWeight: '700', 
          cursor: 'pointer', 
          whiteSpace: 'nowrap',
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px',
          transition: DS.transitions.base,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = DS.colors.primary.light
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = DS.colors.primary.main
        }}
        >
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
              backgroundColor: DS.colors.bg.secondary, 
              borderRadius: DS.borderRadius.lg,
              padding: '20px', 
              border: `1px solid ${DS.colors.neutral.light}`,
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              transition: DS.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = DS.colors.primary.main
              e.currentTarget.style.backgroundColor = DS.colors.neutral.charcoal + '40'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = DS.colors.neutral.light
              e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
            }}
            >
              <div style={{
                width: '48px', 
                height: '48px', 
                backgroundColor: DS.colors.primary.main + '15',
                borderRadius: DS.borderRadius.lg, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center', 
                fontSize: '24px', 
                border: `1px solid ${DS.colors.primary.main}30`,
              }}>
                🎵
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: DS.colors.text.dark, marginBottom: '4px' }}>
                  {pl.title}
                </h3>
                {pl.description && (
                  <p style={{
                    fontSize: '13px', 
                    color: DS.colors.text.secondary, 
                    lineHeight: 1.5,
                    display: '-webkit-box', 
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    margin: 0,
                  }}>
                    {pl.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', 
                    color: DS.colors.text.secondary,
                    backgroundColor: DS.colors.neutral.charcoal, 
                    padding: '3px 8px', 
                    borderRadius: DS.borderRadius.full,
                  }}>
                    {new Date(pl.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {pl.public && (
                    <span style={{
                      fontSize: '11px', 
                      color: DS.colors.secondary.success,
                      backgroundColor: DS.colors.secondary.success + '15', 
                      padding: '3px 8px',
                      borderRadius: DS.borderRadius.full, 
                      fontWeight: '600',
                    }}>
                      🌐 Pública
                    </span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(pl)} style={{
                  flex: 1, 
                  backgroundColor: DS.colors.neutral.charcoal, 
                  color: DS.colors.text.secondary,
                  border: `1px solid ${DS.colors.neutral.light}`, 
                  borderRadius: DS.borderRadius.md, 
                  padding: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: DS.transitions.base,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.color = DS.colors.primary.main
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.neutral.light
                  e.currentTarget.style.color = DS.colors.text.secondary
                }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(pl.id)}
                  disabled={deleteId === pl.id}
                  style={{
                    backgroundColor: DS.colors.secondary.error + '15', 
                    color: DS.colors.secondary.error,
                    border: `1px solid ${DS.colors.secondary.error}30`, 
                    borderRadius: DS.borderRadius.md,
                    padding: '8px 12px', 
                    fontSize: '13px', 
                    cursor: 'pointer',
                    transition: DS.transitions.base,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = DS.colors.secondary.error + '25'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = DS.colors.secondary.error + '15'
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
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 300 }}
            onClick={() => setShowModal(false)}
          />
          <div style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: DS.colors.bg.secondary, 
            borderRadius: DS.borderRadius.xl,
            padding: '32px', 
            width: '100%', 
            maxWidth: '440px',
            zIndex: 301, 
            boxShadow: DS.shadows['2xl'],
            border: `1px solid ${DS.colors.neutral.light}`,
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: DS.colors.text.dark, marginBottom: '20px' }}>
              {editItem ? '✏️ Editar Playlist' : '🎵 Nova Playlist'}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nome da playlist *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Louvores da Manhã"
                autoFocus
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
                onBlur={(e)  => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Descrição</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Opcional..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
                onBlur={(e)  => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
              />
            </div>

            <label style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              cursor: 'pointer', 
              marginBottom: '24px',
            }}>
              <input
                type="checkbox"
                checked={formPublic}
                onChange={(e) => setFormPublic(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: DS.colors.primary.main }}
              />
              <span style={{ fontSize: '14px', color: DS.colors.text.secondary }}>
                🌐 Tornar pública (qualquer pessoa pode ver)
              </span>
            </label>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, 
                backgroundColor: DS.colors.neutral.charcoal, 
                color: DS.colors.text.secondary,
                border: `1px solid ${DS.colors.neutral.light}`, 
                borderRadius: DS.borderRadius.md, 
                padding: '12px',
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.neutral.medium
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.neutral.charcoal
              }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formTitle.trim()}
                style={{
                  flex: 1, 
                  backgroundColor: !formTitle.trim() ? DS.colors.primary.dark : DS.colors.primary.main,
                  color: 'white', 
                  border: 'none', 
                  borderRadius: DS.borderRadius.md,
                  padding: '12px', 
                  fontSize: '14px', 
                  fontWeight: '700',
                  cursor: saving || !formTitle.trim() ? 'not-allowed' : 'pointer',
                  opacity: !formTitle.trim() ? 0.6 : 1,
                  transition: DS.transitions.base,
                }}
                onMouseEnter={(e) => {
                  if (formTitle.trim() && !saving) e.currentTarget.style.backgroundColor = DS.colors.primary.light
                }}
                onMouseLeave={(e) => {
                  if (formTitle.trim() && !saving) e.currentTarget.style.backgroundColor = DS.colors.primary.main
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

function Empty({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{
      backgroundColor: DS.colors.bg.secondary, 
      borderRadius: DS.borderRadius.xl, 
      padding: '64px 32px',
      textAlign: 'center', 
      border: `1px solid ${DS.colors.neutral.light}`,
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎶</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: DS.colors.text.dark, marginBottom: '8px' }}>
        Nenhuma playlist criada ainda
      </h2>
      <p style={{ color: DS.colors.text.secondary, fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
        Crie playlists personalizadas com pregações,<br />louvores e devocionais.
      </p>
      <button onClick={onCreate} style={{
        backgroundColor: DS.colors.primary.main, 
        color: 'white', 
        border: 'none',
        padding: '12px 28px', 
        borderRadius: DS.borderRadius.md, 
        fontSize: '15px',
        fontWeight: '700', 
        cursor: 'pointer',
        transition: DS.transitions.base,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = DS.colors.primary.light
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = DS.colors.primary.main
      }}
      >
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
          backgroundColor: DS.colors.bg.secondary, 
          borderRadius: DS.borderRadius.lg, 
          padding: '20px',
          border: `1px solid ${DS.colors.neutral.light}`,
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: DS.colors.neutral.medium, borderRadius: DS.borderRadius.lg, marginBottom: '12px' }} />
          <div style={{ height: '18px', backgroundColor: DS.colors.neutral.medium, borderRadius: '4px', width: '70%', marginBottom: '8px' }} />
          <div style={{ height: '14px', backgroundColor: DS.colors.neutral.medium, borderRadius: '4px', width: '90%' }} />
        </div>
      ))}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', 
  color: DS.colors.text.secondary, 
  fontSize: '13px',
  fontWeight: '600', 
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', 
  backgroundColor: DS.colors.neutral.charcoal, 
  border: `1px solid ${DS.colors.neutral.light}`,
  borderRadius: DS.borderRadius.md, 
  padding: '12px 16px', 
  color: DS.colors.text.primary, 
  fontSize: '15px',
  outline: 'none', 
  boxSizing: 'border-box', 
  transition: DS.transitions.base,
}