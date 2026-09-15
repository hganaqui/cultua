'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM
const ERROR_COLOR = '#C84C3C'

interface FormData {
  name: string
  description: string
  color: string
  icon: string
}

const EMOJI_OPTIONS = [
  '🎵', '😊', '🕊️', '🌟', '💜', '💑',
  '🏥', '✨', '💪', '🙏', '❤️', '💔',
  '😰', '😢', '🎉', '🔥', '📖', '🌱',
  '🏠', '🤝', '🎯', '💡', '🌿', '⚡',
]

export default function AdminTagsClient() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [tags, setTags]             = useState<Tag[]>([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState<string | null>(null)
  const [editing, setEditing]       = useState<Tag | null>(null)
  const [showForm, setShowForm]     = useState(false)

  const [form, setForm] = useState<FormData>({
    name: '', description: '',
    color: DS.colors.primary.main,
    icon: '🎵',
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/auth/login'); return }

        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', user.id).single()

        if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
          router.push('/'); return
        }

        setAuthorized(true)
        loadTags()
      } catch (err) {
        console.error('[AdminTagsClient] checkAuth:', err)
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  async function loadTags() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tags').select('*').order('name')
      if (error) throw error
      setTags(data ?? [])
    } catch (err) {
      console.error('[AdminTagsClient] loadTags:', err)
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-').trim()
  }

  async function handleSave() {
    if (!form.name.trim()) { alert('Nome da tag é obrigatório'); return }
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('tags')
          .update({ name: form.name.trim(), description: form.description.trim(), color: form.color, icon: form.icon })
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('tags')
          .insert({ name: form.name.trim(), slug: generateSlug(form.name), description: form.description.trim(), color: form.color, icon: form.icon })
        if (error) throw error
      }
      await loadTags()
      resetForm()
      alert(editing ? 'Tag atualizada!' : 'Tag criada!')
    } catch (err) {
      console.error('[AdminTagsClient] handleSave:', err)
      alert('Erro ao salvar tag')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tagId: string) {
    if (!confirm('Tem certeza que quer deletar esta tag?')) return
    setDeleting(tagId)
    try {
      const { error } = await supabase.from('tags').delete().eq('id', tagId)
      if (error) throw error
      await loadTags()
      alert('Tag deletada!')
    } catch (err) {
      console.error('[AdminTagsClient] handleDelete:', err)
      alert('Erro ao deletar tag')
    } finally {
      setDeleting(null)
    }
  }

  function handleEdit(tag: Tag) {
    setEditing(tag)
    setForm({ name: tag.name, description: tag.description ?? '', color: tag.color, icon: tag.icon })
    setShowForm(true)
  }

  function resetForm() {
    setForm({ name: '', description: '', color: DS.colors.primary.main, icon: '🎵' })
    setEditing(null)
    setShowForm(false)
  }

  if (!authorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary }}>
        Verificando permissões...
      </div>
    )
  }

  const canSave = !saving && form.name.trim().length > 0

  return (
    <main style={{ maxWidth: '1200px', width: '100%', boxSizing: 'border-box' as const, margin: '0 auto', padding: '32px 16px' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '12px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: DS.typography.fontSize['4xl'], fontWeight: DS.typography.fontWeight.bold, color: DS.colors.text.primary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            🏷️ Gerenciar Temas
          </h1>
          <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: DS.typography.fontSize.base, margin: 0 }}>
            Crie e organize temas para filtrar conteúdos
          </p>
        </div>
        <button
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          style={{ backgroundColor: showForm ? ERROR_COLOR : DS.colors.primary.main, color: '#FFFFFF', border: 'none', borderRadius: DS.borderRadius.lg, padding: '10px 20px', fontFamily: DS.typography.fontFamily.body, fontSize: DS.typography.fontSize.base, fontWeight: DS.typography.fontWeight.semibold, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' as const, transition: DS.transitions.fast, boxShadow: showForm ? 'none' : '0 4px 16px rgba(15,61,46,0.2)' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {showForm ? '✕ Cancelar' : '+ Nova Tag'}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={{ backgroundColor: DS.colors.bg.secondary, border: `1px solid ${DS.colors.neutral.light}`, borderRadius: DS.borderRadius.xl, padding: '24px', marginBottom: '32px', boxShadow: DS.shadows.sm }}>
          <h2 style={{ fontFamily: DS.typography.fontFamily.heading, color: DS.colors.text.primary, fontSize: DS.typography.fontSize['3xl'], fontWeight: DS.typography.fontWeight.bold, marginBottom: '20px' }}>
            {editing ? '✏️ Editar Tema' : '✨ Novo Tema'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>

            {/* Nome */}
            <div>
              <label style={{ display: 'block', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, marginBottom: '8px' }}>
                Nome da Tag *
              </label>
              <input
                type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Oração"
                style={{ width: '100%', backgroundColor: DS.colors.bg.secondary, border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, padding: '10px 14px', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, transition: DS.transitions.fast }}
                onFocus={e => { e.target.style.borderColor = DS.colors.primary.main; e.target.style.boxShadow = '0 0 0 3px rgba(15,61,46,0.10)' }}
                onBlur={e => { e.target.style.borderColor = DS.colors.neutral.medium; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Descrição */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, marginBottom: '8px' }}>
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva o tema..." rows={3}
                style={{ width: '100%', backgroundColor: DS.colors.bg.secondary, border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, padding: '10px 14px', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const, transition: DS.transitions.fast }}
                onFocus={e => { e.target.style.borderColor = DS.colors.primary.main; e.target.style.boxShadow = '0 0 0 3px rgba(15,61,46,0.10)' }}
                onBlur={e => { e.target.style.borderColor = DS.colors.neutral.medium; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Cor */}
            <div>
              <label style={{ display: 'block', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, marginBottom: '8px' }}>
                Cor
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="color" value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  style={{ width: '48px', height: '42px', border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, cursor: 'pointer', padding: '2px', backgroundColor: 'transparent' }}
                />
                <input type="text" value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  placeholder="#0F3D2E"
                  style={{ flex: 1, backgroundColor: DS.colors.bg.secondary, border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, padding: '10px 14px', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, transition: DS.transitions.fast }}
                  onFocus={e => { e.target.style.borderColor = DS.colors.primary.main; e.target.style.boxShadow = '0 0 0 3px rgba(15,61,46,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = DS.colors.neutral.medium; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Emoji */}
            <div>
              <label style={{ display: 'block', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.primary, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, marginBottom: '8px' }}>
                Ícone — selecionado: <span style={{ fontSize: '18px' }}>{form.icon}</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                {EMOJI_OPTIONS.map(emoji => (
                  <button key={emoji} type="button"
                    onClick={() => setForm({ ...form, icon: emoji })}
                    style={{ backgroundColor: form.icon === emoji ? form.color : DS.colors.bg.primary, border: `1.5px solid ${form.icon === emoji ? form.color : DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, padding: '8px', fontSize: '18px', cursor: 'pointer', transition: DS.transitions.fast, lineHeight: 1 }}
                    onMouseEnter={e => { if (form.icon !== emoji) { e.currentTarget.style.borderColor = form.color; e.currentTarget.style.backgroundColor = `${form.color}15` } }}
                    onMouseLeave={e => { if (form.icon !== emoji) { e.currentTarget.style.borderColor = DS.colors.neutral.medium; e.currentTarget.style.backgroundColor = DS.colors.bg.primary } }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ backgroundColor: `${form.color}12`, border: `2px solid ${form.color}50`, borderRadius: DS.borderRadius.lg, padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: `${form.color}20`, borderRadius: DS.borderRadius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
              {form.icon}
            </div>
            <div>
              <div style={{ fontFamily: DS.typography.fontFamily.heading, color: form.color, fontSize: '18px', fontWeight: DS.typography.fontWeight.bold, marginBottom: '4px' }}>
                {form.name || 'Nome da Tag'}
              </div>
              <div style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '13px' }}>
                {form.description || 'Descrição da tag'}
              </div>
              <div style={{ display: 'inline-block', marginTop: '6px', backgroundColor: `${form.color}20`, color: form.color, fontSize: '11px', fontFamily: DS.typography.fontFamily.body, fontWeight: DS.typography.fontWeight.semibold, padding: '2px 8px', borderRadius: DS.borderRadius.full, border: `1px solid ${form.color}40` }}>
                {form.icon} {form.name || 'tag'}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetForm}
              style={{ backgroundColor: DS.colors.bg.primary, color: DS.colors.text.secondary, border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.lg, padding: '10px 24px', fontFamily: DS.typography.fontFamily.body, fontSize: DS.typography.fontSize.base, fontWeight: DS.typography.fontWeight.medium, cursor: 'pointer', transition: DS.transitions.fast }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = DS.colors.neutral.medium)}
            >
              Cancelar
            </button>
            <button type="button" onClick={handleSave} disabled={!canSave}
              style={{ backgroundColor: canSave ? DS.colors.primary.main : DS.colors.neutral.medium, color: '#FFFFFF', border: 'none', borderRadius: DS.borderRadius.lg, padding: '10px 24px', fontFamily: DS.typography.fontFamily.body, fontSize: DS.typography.fontSize.base, fontWeight: DS.typography.fontWeight.semibold, cursor: canSave ? 'pointer' : 'not-allowed', opacity: canSave ? 1 : 0.65, transition: DS.transitions.fast, boxShadow: canSave ? '0 4px 16px rgba(15,61,46,0.2)' : 'none' }}
              onMouseEnter={e => { if (canSave) e.currentTarget.style.backgroundColor = DS.colors.primary.light }}
              onMouseLeave={e => { if (canSave) e.currentTarget.style.backgroundColor = DS.colors.primary.main }}
            >
              {saving ? 'Salvando...' : editing ? '✓ Salvar Alterações' : '✓ Criar Tag'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary }}>
          Carregando tags...
        </div>
      ) : tags.length === 0 ? (
        <div style={{ backgroundColor: DS.colors.bg.secondary, borderRadius: DS.borderRadius.xl, padding: '56px 32px', textAlign: 'center', border: `1px solid ${DS.colors.neutral.light}` }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
          <h3 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: DS.typography.fontSize['3xl'], color: DS.colors.text.primary, marginBottom: '8px' }}>
            Nenhuma tag criada ainda
          </h3>
          <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: DS.typography.fontSize.base, margin: 0 }}>
            Clique em "+ Nova Tag" para criar a primeira
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {tags.map(tag => (
            <div key={tag.id}
              style={{ backgroundColor: DS.colors.bg.secondary, border: `1.5px solid ${DS.colors.neutral.light}`, borderRadius: DS.borderRadius.xl, padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '12px', transition: DS.transitions.base, boxShadow: DS.shadows.sm }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = tag.color; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = DS.shadows.md }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = DS.colors.neutral.light; el.style.transform = 'translateY(0)'; el.style.boxShadow = DS.shadows.sm }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: `${tag.color}18`, borderRadius: DS.borderRadius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  {tag.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: DS.typography.fontFamily.heading, color: DS.colors.text.primary, fontSize: '15px', fontWeight: DS.typography.fontWeight.bold, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {tag.name}
                  </div>
                  <div style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.muted, fontSize: '11px' }}>
                    /{tag.slug}
                  </div>
                </div>
              </div>

              {tag.description && (
                <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '13px', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                  {tag.description}
                </p>
              )}

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: `${tag.color}15`, borderRadius: DS.borderRadius.md, padding: '6px 10px', width: 'fit-content' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: tag.color, flexShrink: 0 }} />
                <span style={{ fontFamily: DS.typography.fontFamily.body, color: tag.color, fontSize: '11px', fontWeight: DS.typography.fontWeight.semibold, letterSpacing: '0.3px' }}>
                  {tag.color}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={() => handleEdit(tag)}
                  style={{ flex: 1, backgroundColor: DS.colors.bg.primary, color: DS.colors.text.secondary, border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.lg, padding: '8px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: 'pointer', transition: DS.transitions.fast }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = DS.colors.primary.main; e.currentTarget.style.color = DS.colors.primary.main }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = DS.colors.neutral.medium; e.currentTarget.style.color = DS.colors.text.secondary }}
                >
                  ✏️ Editar
                </button>
                <button type="button" onClick={() => handleDelete(tag.id)} disabled={deleting === tag.id}
                  style={{ flex: 1, backgroundColor: `${ERROR_COLOR}12`, color: ERROR_COLOR, border: `1.5px solid ${ERROR_COLOR}35`, borderRadius: DS.borderRadius.lg, padding: '8px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: deleting === tag.id ? 'not-allowed' : 'pointer', opacity: deleting === tag.id ? 0.6 : 1, transition: DS.transitions.fast }}
                  onMouseEnter={e => { if (deleting !== tag.id) e.currentTarget.style.backgroundColor = `${ERROR_COLOR}22` }}
                  onMouseLeave={e => { if (deleting !== tag.id) e.currentTarget.style.backgroundColor = `${ERROR_COLOR}12` }}
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