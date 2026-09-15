'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface FormData {
  name: string
  description: string
  color: string
  icon: string
}

export default function AdminTagsClient() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<Tag | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    color: DS.colors.primary.main,
    icon: '🎵',
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
          router.push('/')
          return
        }

        setAuthorized(true)
        loadTags()
      } catch (err) {
        console.error('Erro na autenticacao:', err)
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  async function loadTags() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name')

      if (error) throw error
      setTags(data || [])
    } catch (err) {
      console.error('Erro ao carregar tags:', err)
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert('Nome da tag é obrigatório')
      return
    }

    setSaving(true)
    try {
      const slug = generateSlug(form.name)

      if (editing) {
        const { error } = await supabase
          .from('tags')
          .update({
            name: form.name.trim(),
            description: form.description.trim(),
            color: form.color,
            icon: form.icon,
          })
          .eq('id', editing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('tags')
          .insert({
            name: form.name.trim(),
            slug,
            description: form.description.trim(),
            color: form.color,
            icon: form.icon,
          })

        if (error) throw error
      }

      await loadTags()
      resetForm()
      alert(editing ? 'Tag atualizada!' : 'Tag criada!')
    } catch (err) {
      console.error('Erro ao salvar:', err)
      alert('Erro ao salvar tag')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tagId: string) {
    if (!confirm('Tem certeza que quer deletar esta tag?')) {
      return
    }

    setDeleting(tagId)
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)

      if (error) throw error
      await loadTags()
      alert('Tag deletada!')
    } catch (err) {
      console.error('Erro ao deletar:', err)
      alert('Erro ao deletar tag')
    } finally {
      setDeleting(null)
    }
  }

  function handleEdit(tag: Tag) {
    setEditing(tag)
    setForm({
      name: tag.name,
      description: tag.description || '',
      color: tag.color,
      icon: tag.icon,
    })
    setShowForm(true)
  }

  function resetForm() {
    setForm({
      name: '',
      description: '',
      color: DS.colors.primary.main,
      icon: '🎵',
    })
    setEditing(null)
    setShowForm(false)
  }

  if (!authorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: DS.colors.text.secondary }}>
        Verificando permissões...
      </div>
    )
  }

  const EMOJI_OPTIONS = ['🎵', '😊', '🕊️', '🌟', '💜', '💑', '🏥', '✨', '💪', '🙏', '❤️', '💔', '😰', '😢', '🎉', '🔥']

  return (
    <main style={{
      maxWidth: '1200px',
      width: '100%',
      boxSizing: 'border-box',
      margin: '0 auto',
      padding: '32px 16px',
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: DS.colors.text.dark, marginBottom: '4px' }}>
            Gerenciar Temas
          </h1>
          <p style={{ color: DS.colors.text.secondary, fontSize: '14px' }}>
            Crie e organize temas para filtrar conteúdos
          </p>
        </div>

        <button
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          style={{
            backgroundColor: showForm ? DS.colors.secondary.error : DS.colors.primary.main,
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: DS.borderRadius.md,
            fontSize: '14px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: DS.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Nova Tag'}
        </button>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{
          backgroundColor: DS.colors.bg.secondary,
          border: `1px solid ${DS.colors.neutral.light}`,
          borderRadius: DS.borderRadius.lg,
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h2 style={{ color: DS.colors.text.dark, fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
            {editing ? 'Editar Tema' : 'Novo Tema'}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}>
            {/* Nome */}
            <div>
              <label style={{ display: 'block', color: DS.colors.text.secondary, fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                Nome da Tag
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Ansiedade"
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${DS.colors.neutral.light}`,
                  borderRadius: DS.borderRadius.md,
                  padding: '10px 14px',
                  color: DS.colors.text.primary,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: DS.transitions.base,
                }}
                onFocus={(e) => (e.target.style.borderColor = DS.colors.primary.main)}
                onBlur={(e) => (e.target.style.borderColor = DS.colors.neutral.light)}
              />
            </div>

            {/* Descrição */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: DS.colors.text.secondary, fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva o tema..."
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${DS.colors.neutral.light}`,
                  borderRadius: DS.borderRadius.md,
                  padding: '10px 14px',
                  color: DS.colors.text.primary,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                  transition: DS.transitions.base,
                }}
                onFocus={(e) => (e.target.style.borderColor = DS.colors.primary.main)}
                onBlur={(e) => (e.target.style.borderColor = DS.colors.neutral.light)}
              />
            </div>

            {/* Cor */}
            <div>
              <label style={{ display: 'block', color: DS.colors.text.secondary, fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                Cor
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  style={{
                    width: '50px',
                    height: '40px',
                    border: 'none',
                    borderRadius: DS.borderRadius.md,
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder={DS.colors.primary.main}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${DS.colors.neutral.light}`,
                    borderRadius: DS.borderRadius.md,
                    padding: '10px 14px',
                    color: DS.colors.text.primary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: DS.transitions.base,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = DS.colors.primary.main)}
                  onBlur={(e) => (e.target.style.borderColor = DS.colors.neutral.light)}
                />
              </div>
            </div>

            {/* Emoji */}
            <div>
              <label style={{ display: 'block', color: DS.colors.text.secondary, fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                Emoji
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setForm({ ...form, icon: emoji })}
                    type="button"
                    style={{
                      backgroundColor: form.icon === emoji ? form.color : DS.colors.bg.secondary,
                      border: `2px solid ${form.icon === emoji ? form.color : DS.colors.neutral.light}`,
                      borderRadius: DS.borderRadius.md,
                      padding: '10px',
                      fontSize: '20px',
                      cursor: 'pointer',
                      transition: DS.transitions.base,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = form.color + '20'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = form.icon === emoji ? form.color : DS.colors.bg.secondary
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{
            backgroundColor: form.color + '15',
            border: `2px solid ${form.color}`,
            borderRadius: DS.borderRadius.lg,
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{form.icon}</div>
            <div style={{ color: form.color, fontSize: '16px', fontWeight: '700' }}>
              {form.name || 'Nome da Tag'}
            </div>
            <div style={{ color: form.color + 'CC', fontSize: '12px', marginTop: '4px' }}>
              {form.description || 'Descrição da tag'}
            </div>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={resetForm}
              type="button"
              style={{
                backgroundColor: DS.colors.neutral.charcoal,
                color: DS.colors.text.secondary,
                border: `1px solid ${DS.colors.neutral.light}`,
                borderRadius: DS.borderRadius.md,
                padding: '10px 20px',
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
              disabled={saving || !form.name.trim()}
              type="button"
              style={{
                backgroundColor: saving || !form.name.trim() ? DS.colors.primary.dark + '80' : DS.colors.primary.main,
                color: 'white',
                border: 'none',
                borderRadius: DS.borderRadius.md,
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                if (!saving && form.name.trim()) e.currentTarget.style.backgroundColor = DS.colors.primary.light
              }}
              onMouseLeave={(e) => {
                if (!saving && form.name.trim()) e.currentTarget.style.backgroundColor = DS.colors.primary.main
              }}
            >
              {saving ? 'Salvando...' : 'Salvar Tag'}
            </button>
          </div>
        </div>
      )}

      {/* LISTA DE TAGS */}
      {loading ? (
        <div style={{ color: DS.colors.text.secondary, textAlign: 'center', padding: '40px' }}>
          Carregando tags...
        </div>
      ) : tags.length === 0 ? (
        <div style={{
          backgroundColor: DS.colors.bg.secondary,
          borderRadius: DS.borderRadius.lg,
          padding: '48px',
          textAlign: 'center',
          color: DS.colors.text.secondary,
          border: `1px solid ${DS.colors.neutral.light}`,
        }}>
          <p>Nenhuma tag criada ainda</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Clique em "Nova Tag" para criar a primeira
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px',
        }}>
          {tags.map(tag => (
            <div
              key={tag.id}
              style={{
                backgroundColor: DS.colors.bg.secondary,
                border: `2px solid ${tag.color}`,
                borderRadius: DS.borderRadius.lg,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tag.color + '10'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px' }}>{tag.icon}</div>
                <div>
                  <div style={{ color: DS.colors.text.dark, fontSize: '16px', fontWeight: '700' }}>
                    {tag.name}
                  </div>
                  <div style={{ color: DS.colors.text.secondary, fontSize: '12px' }}>
                    /{tag.slug}
                  </div>
                </div>
              </div>

              {tag.description && (
                <p style={{
                  color: DS.colors.text.secondary,
                  fontSize: '13px',
                  margin: '0',
                  lineHeight: 1.4,
                }}>
                  {tag.description}
                </p>
              )}

              <div style={{
                backgroundColor: tag.color + '20',
                borderRadius: DS.borderRadius.md,
                padding: '8px 12px',
                display: 'inline-block',
                width: 'fit-content',
              }}>
                <span style={{ color: tag.color, fontSize: '12px', fontWeight: '600' }}>
                  Cor: {tag.color}
                </span>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
              }}>
                <button
                  onClick={() => handleEdit(tag)}
                  type="button"
                  style={{
                    flex: 1,
                    backgroundColor: DS.colors.neutral.charcoal,
                    color: DS.colors.text.secondary,
                    border: `1px solid ${DS.colors.neutral.light}`,
                    borderRadius: DS.borderRadius.md,
                    padding: '8px 12px',
                    fontSize: '13px',
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
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  disabled={deleting === tag.id}
                  type="button"
                  style={{
                    flex: 1,
                    backgroundColor: DS.colors.secondary.error + '15',
                    color: DS.colors.secondary.error,
                    border: `1px solid ${DS.colors.secondary.error}30`,
                    borderRadius: DS.borderRadius.md,
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: deleting === tag.id ? 'not-allowed' : 'pointer',
                    opacity: deleting === tag.id ? 0.6 : 1,
                    transition: DS.transitions.base,
                  }}
                >
                  {deleting === tag.id ? '...' : '🗑️ Deletar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}