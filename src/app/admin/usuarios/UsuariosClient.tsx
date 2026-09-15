'use client'

import { useState } from 'react'
import type { AdminWithScopes, Category, UserRole } from '@/types'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

const SUCCESS_COLOR = '#6B7F6B'
const ERROR_COLOR   = '#C84C3C'

interface Creator { id: string; full_name: string | null }

interface Props {
  users:       AdminWithScopes[]
  categories:  Category[]
  allCreators: Creator[]
}

const ROLE_CFG = {
  user:       { label: 'Usuário',    color: DS.colors.text.muted,    bg: DS.colors.neutral.light,       border: DS.colors.neutral.medium },
  admin:      { label: 'Admin',      color: DS.colors.primary.main,  bg: `${DS.colors.primary.main}15`, border: `${DS.colors.primary.main}40` },
  superadmin: { label: 'Superadmin', color: '#A855F7',               bg: 'rgba(168,85,247,0.15)',        border: 'rgba(168,85,247,0.4)' },
} as const

export default function UsuariosClient({ users, categories, allCreators }: Props) {
  const [list, setList]         = useState(users)
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [msg, setMsg]           = useState('')
  const [loading, setLoading]   = useState('')

  const filtered = list.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function showMsg(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  async function changeRole(userId: string, newRole: UserRole) {
    setLoading(`role-${userId}`)
    const res = await fetch('/api/admin/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    })
    setLoading('')
    if (!res.ok) { showMsg('❌ Erro ao alterar role.'); return }
    setList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    showMsg('✅ Role atualizado!')
    if (newRole === 'user') setExpanded(null)
  }

  async function addScope(adminId: string, scopeType: 'category' | 'creator', scopeValue: string) {
    if (!scopeValue) return
    setLoading(`add-${adminId}-${scopeType}-${scopeValue}`)
    const res = await fetch('/api/admin/scopes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: adminId, scope_type: scopeType, scope_value: scopeValue }),
    })
    setLoading('')
    if (!res.ok) { showMsg('❌ Erro ao adicionar escopo.'); return }
    setList(prev => prev.map(u => {
      if (u.id !== adminId) return u
      const key = scopeType === 'category' ? 'categories' : 'creators'
      if (u.scopes[key].includes(scopeValue)) return u
      return { ...u, scopes: { ...u.scopes, [key]: [...u.scopes[key], scopeValue] } }
    }))
    showMsg('✅ Escopo adicionado!')
  }

  async function removeScope(adminId: string, scopeType: 'category' | 'creator', scopeValue: string) {
    setLoading(`rm-${adminId}-${scopeType}-${scopeValue}`)
    const res = await fetch('/api/admin/scopes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: adminId, scope_type: scopeType, scope_value: scopeValue }),
    })
    setLoading('')
    if (!res.ok) { showMsg('❌ Erro ao remover escopo.'); return }
    setList(prev => prev.map(u => {
      if (u.id !== adminId) return u
      const key = scopeType === 'category' ? 'categories' : 'creators'
      return { ...u, scopes: { ...u.scopes, [key]: u.scopes[key].filter(v => v !== scopeValue) } }
    }))
    showMsg('✅ Escopo removido!')
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: DS.colors.bg.primary, padding: '40px 16px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: DS.typography.fontSize['5xl'], fontWeight: DS.typography.fontWeight.bold, color: DS.colors.text.primary, marginBottom: '4px', letterSpacing: '-0.5px' }}>
            ⚡ Gerenciar Usuários
          </h1>
          <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: DS.typography.fontSize.base }}>
            {list.length} usuário{list.length !== 1 ? 's' : ''} · defina roles e escopos de moderação
          </p>
        </div>

        {msg && (
          <div style={{
            padding: '12px 16px', borderRadius: DS.borderRadius.lg, marginBottom: '16px',
            backgroundColor: msg.startsWith('✅') ? `${SUCCESS_COLOR}15` : `${ERROR_COLOR}15`,
            color: msg.startsWith('✅') ? SUCCESS_COLOR : ERROR_COLOR,
            border: `1px solid ${msg.startsWith('✅') ? `${SUCCESS_COLOR}33` : `${ERROR_COLOR}33`}`,
            fontFamily: DS.typography.fontFamily.body, fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold,
          }}>
            {msg}
          </div>
        )}

        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          style={{
            width: '100%', boxSizing: 'border-box' as const,
            backgroundColor: DS.colors.bg.secondary,
            border: `1.5px solid ${DS.colors.neutral.medium}`,
            borderRadius: DS.borderRadius.lg, padding: '12px 16px',
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.primary, fontSize: '14px',
            outline: 'none', marginBottom: '20px',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = DS.colors.primary.main; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,61,46,0.10)' }}
          onBlur={e => { e.currentTarget.style.borderColor = DS.colors.neutral.medium; e.currentTarget.style.boxShadow = 'none' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {filtered.map(u => {
            const rcfg    = ROLE_CFG[u.role]
            const isExp   = expanded === u.id
            const isAdmin = u.role === 'admin'

            return (
              <div key={u.id} style={{
                backgroundColor: DS.colors.bg.secondary,
                border: `1px solid ${isExp ? `${DS.colors.primary.main}44` : DS.colors.neutral.light}`,
                borderRadius: DS.borderRadius.xl, overflow: 'hidden',
                boxShadow: DS.shadows.sm, transition: DS.transitions.fast,
              }}>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' as const }}>

                  {/* Avatar */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    backgroundColor: rcfg.bg, border: `2px solid ${rcfg.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: DS.typography.fontFamily.heading,
                    fontSize: '17px', fontWeight: DS.typography.fontWeight.bold,
                    color: rcfg.color, flexShrink: 0,
                  }}>
                    {(u.full_name ?? u.email)[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <p style={{ fontFamily: DS.typography.fontFamily.heading, color: DS.colors.text.primary, fontWeight: DS.typography.fontWeight.semibold, fontSize: '14px', marginBottom: '2px' }}>
                      {u.full_name ?? '—'}
                    </p>
                    <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px' }}>
                      {u.email}
                    </p>
                  </div>

                  {/* Badges escopo */}
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                      <ScopeBadge label={`${u.scopes.categories.length} categoria${u.scopes.categories.length !== 1 ? 's' : ''}`} color="#22C55E" />
                      <ScopeBadge label={`${u.scopes.creators.length} criador${u.scopes.creators.length !== 1 ? 'es' : ''}`} color="#60A5FA" />
                    </div>
                  )}

                  {/* Badge role */}
                  <span style={{
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '11px', fontWeight: DS.typography.fontWeight.bold,
                    color: rcfg.color, backgroundColor: rcfg.bg,
                    padding: '3px 10px', borderRadius: DS.borderRadius.full,
                    border: `1px solid ${rcfg.border}`, flexShrink: 0,
                  }}>
                    {rcfg.label}
                  </span>

                  {/* Select role — dourado */}
                  <select
                    value={u.role}
                    disabled={loading === `role-${u.id}`}
                    onChange={e => changeRole(u.id, e.target.value as UserRole)}
                    style={{
                      backgroundColor: DS.colors.primary.accent,
                      color: DS.colors.primary.main,
                      border: `2px solid ${DS.colors.primary.accent}`,
                      borderRadius: DS.borderRadius.md, padding: '8px 12px',
                      fontFamily: DS.typography.fontFamily.body,
                      fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold,
                      cursor: 'pointer', flexShrink: 0, transition: DS.transitions.fast,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = DS.colors.primary.accentLight; e.currentTarget.style.borderColor = DS.colors.primary.accentLight }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = DS.colors.primary.accent; e.currentTarget.style.borderColor = DS.colors.primary.accent }}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>

                  {/* Botão escopos */}
                  {isAdmin && (
                    <button
                      onClick={() => setExpanded(isExp ? null : u.id)}
                      style={{
                        backgroundColor: isExp ? `${DS.colors.primary.main}15` : DS.colors.bg.primary,
                        border: `1.5px solid ${isExp ? DS.colors.primary.main : DS.colors.neutral.medium}`,
                        color: isExp ? DS.colors.primary.main : DS.colors.text.secondary,
                        borderRadius: DS.borderRadius.md, padding: '6px 14px',
                        fontFamily: DS.typography.fontFamily.body,
                        fontSize: '12px', fontWeight: DS.typography.fontWeight.semibold,
                        cursor: 'pointer', flexShrink: 0, transition: DS.transitions.fast,
                      }}
                    >
                      {isExp ? '▲ Fechar' : '⚙️ Escopos'}
                    </button>
                  )}

                  {loading === `role-${u.id}` && (
                    <span style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.primary.main, fontSize: '12px' }}>
                      Salvando...
                    </span>
                  )}
                </div>

                {isExp && isAdmin && (
                  <div style={{
                    borderTop: `1px solid ${DS.colors.neutral.light}`,
                    padding: '20px', display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: '24px',
                  }}>
                    <ScopePanel
                      title="📂 Categorias"
                      description="Admin modera conteúdos dessas categorias"
                      color="#22C55E"
                      items={u.scopes.categories.map(id => ({ id, label: categories.find(c => c.id === id)?.name ?? id }))}
                      options={categories.filter(c => !u.scopes.categories.includes(c.id)).map(c => ({ value: c.id, label: c.name }))}
                      onAdd={val => addScope(u.id, 'category', val)}
                      onRemove={val => removeScope(u.id, 'category', val)}
                      loading={loading} adminId={u.id} scopeType="category"
                    />
                    <ScopePanel
                      title="👤 Criadores"
                      description="Admin modera uploads dessas pessoas"
                      color="#60A5FA"
                      items={u.scopes.creators.map(id => ({ id, label: allCreators.find(c => c.id === id)?.full_name ?? id }))}
                      options={allCreators.filter(c => !u.scopes.creators.includes(c.id)).map(c => ({ value: c.id, label: c.full_name ?? c.id }))}
                      onAdd={val => addScope(u.id, 'creator', val)}
                      onRemove={val => removeScope(u.id, 'creator', val)}
                      loading={loading} adminId={u.id} scopeType="creator"
                    />
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ backgroundColor: DS.colors.bg.secondary, border: `1px solid ${DS.colors.neutral.light}`, borderRadius: DS.borderRadius.xl, padding: '48px', textAlign: 'center', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <p>Nenhum usuário encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function ScopePanel({ title, description, color, items, options, onAdd, onRemove, loading, adminId, scopeType }: {
  title: string; description: string; color: string
  items: { id: string; label: string | null }[]
  options: { value: string; label: string | null }[]
  onAdd: (val: string) => void; onRemove: (val: string) => void
  loading: string; adminId: string; scopeType: string
}) {
  const [selected, setSelected] = useState('')

  return (
    <div>
      <p style={{ fontFamily: DS.typography.fontFamily.body, color, fontSize: '13px', fontWeight: DS.typography.fontWeight.bold, marginBottom: '4px' }}>{title}</p>
      <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px', marginBottom: '12px' }}>{description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '12px' }}>
        {items.length === 0 ? (
          <span style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.muted, fontSize: '12px', fontStyle: 'italic' }}>
            Nenhum escopo definido
          </span>
        ) : items.map(item => (
          <span key={item.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: `${color}15`, border: `1px solid ${color}44`,
            color, fontFamily: DS.typography.fontFamily.body,
            fontSize: '12px', fontWeight: DS.typography.fontWeight.semibold,
            padding: '4px 10px', borderRadius: DS.borderRadius.full,
          }}>
            {item.label}
            <button onClick={() => onRemove(item.id)} disabled={!!loading}
              style={{ backgroundColor: 'transparent', border: 'none', color, cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1, opacity: 0.7 }}
              title="Remover"
            >×</button>
          </span>
        ))}
      </div>

      {options.length > 0 && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={selected} onChange={e => setSelected(e.target.value)}
            style={{ flex: 1, backgroundColor: DS.colors.bg.primary, border: `1.5px solid ${DS.colors.neutral.medium}`, color: DS.colors.text.primary, borderRadius: DS.borderRadius.md, padding: '6px 10px', fontFamily: DS.typography.fontFamily.body, fontSize: '12px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="">Selecionar...</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => { if (selected) { onAdd(selected); setSelected('') } }}
            disabled={!selected || !!loading}
            style={{ backgroundColor: selected ? color : DS.colors.neutral.medium, border: 'none', color: '#FFFFFF', borderRadius: DS.borderRadius.md, padding: '6px 14px', fontFamily: DS.typography.fontFamily.body, fontSize: '12px', fontWeight: DS.typography.fontWeight.bold, cursor: selected ? 'pointer' : 'not-allowed', opacity: selected ? 1 : 0.5, transition: DS.transitions.fast }}
          >
            + Add
          </button>
        </div>
      )}
    </div>
  )
}

function ScopeBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '11px', color, backgroundColor: `${color}15`, border: `1px solid ${color}33`, padding: '2px 8px', borderRadius: DS.borderRadius.full, fontWeight: DS.typography.fontWeight.semibold }}>
      {label}
    </span>
  )
}