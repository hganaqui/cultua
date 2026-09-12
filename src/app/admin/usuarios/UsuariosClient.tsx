// src/app/admin/usuarios/UsuariosClient.tsx
'use client'

import { useState } from 'react'
import type { AdminWithScopes, Category, UserRole } from '@/types'

interface Creator { id: string; full_name: string | null }

interface Props {
  users: AdminWithScopes[]
  categories: Category[]
  allCreators: Creator[]
}

const ROLE_CFG = {
  user:       { label: 'Usuário',    color: '#666',    bg: '#2a2a2a' },
  admin:      { label: 'Admin',      color: '#B8860B', bg: 'rgba(184,134,11,0.15)' },
  superadmin: { label: 'Superadmin', color: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
}

export default function UsuariosClient({ users, categories, allCreators }: Props) {
  const [list, setList]         = useState(users)
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)  // admin_id expandido
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

  // ── Alterar role ──────────────────────────────────────────────────────────
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
    // Se virou user, fechar escopos
    if (newRole === 'user') setExpanded(null)
  }

  // ── Adicionar escopo ──────────────────────────────────────────────────────
  async function addScope(
    adminId: string, 
    scopeType: 'category' | 'creator', 
    scopeValue: string
  ) {
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
      return {
        ...u,
        scopes: { ...u.scopes, [key]: [...u.scopes[key], scopeValue] }
      }
    }))
    showMsg('✅ Escopo adicionado!')
  }

  // ── Remover escopo ────────────────────────────────────────────────────────
  async function removeScope(
    adminId: string, 
    scopeType: 'category' | 'creator', 
    scopeValue: string
  ) {
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
      return {
        ...u,
        scopes: { ...u.scopes, [key]: u.scopes[key].filter(v => v !== scopeValue) }
      }
    }))
    showMsg('✅ Escopo removido!')
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFF' }}>
          ⚡ Gerenciar Usuários
        </h1>
        <p style={{ color: '#666', marginTop: '4px' }}>
          {list.length} usuários · defina roles e escopos de moderação
        </p>
      </div>

      {/* Toast */}
      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
          backgroundColor: msg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: msg.startsWith('✅') ? '#22C55E' : '#EF4444',
          border: `1px solid ${msg.startsWith('✅') ? '#22C55E33' : '#EF444433'}`,
          fontSize: '14px', fontWeight: '600',
        }}>{msg}</div>
      )}

      {/* Busca */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nome ou e-mail..."
        style={{
          width: '100%', backgroundColor: '#1a1a1a', border: '1px solid #333',
          borderRadius: '10px', padding: '12px 16px', color: '#fff',
          fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
        onBlur={e => (e.currentTarget.style.borderColor = '#333')}
      />

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(u => {
          const rcfg  = ROLE_CFG[u.role]
          const isExp = expanded === u.id
          const isAdmin = u.role === 'admin'

          return (
            <div key={u.id} style={{
              backgroundColor: '#1a1a1a', border: `1px solid ${isExp ? '#B8860B44' : '#2a2a2a'}`,
              borderRadius: '14px', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* ── Linha principal ────────────────────────────────────── */}
              <div style={{
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  backgroundColor: rcfg.bg, border: `2px solid ${rcfg.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '17px', fontWeight: '800', color: rcfg.color, flexShrink: 0,
                }}>
                  {(u.full_name ?? u.email)[0].toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <p style={{ color: '#FFF', fontWeight: '600', fontSize: '14px' }}>
                    {u.full_name ?? '—'}
                  </p>
                  <p style={{ color: '#555', fontSize: '12px' }}>{u.email}</p>
                </div>

                {/* Badge escopos (só admin) */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <ScopeBadge
                      label={`${u.scopes.categories.length} categoria${u.scopes.categories.length !== 1 ? 's' : ''}`}
                      color="#22C55E"
                    />
                    <ScopeBadge
                      label={`${u.scopes.creators.length} criador${u.scopes.creators.length !== 1 ? 'es' : ''}`}
                      color="#60A5FA"
                    />
                  </div>
                )}

                {/* Role badge */}
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: rcfg.color,
                  backgroundColor: rcfg.bg, padding: '3px 10px',
                  borderRadius: '9999px', border: `1px solid ${rcfg.color}44`,
                  flexShrink: 0,
                }}>
                  {rcfg.label}
                </span>

                {/* Selector de role */}
                <select
                  value={u.role}
                  disabled={loading === `role-${u.id}`}
                  onChange={e => changeRole(u.id, e.target.value as UserRole)}
                  style={{
                    backgroundColor: '#2a2a2a', border: '1px solid #444',
                    color: '#CCC', borderRadius: '8px', padding: '6px 10px',
                    fontSize: '13px', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>

                {/* Botão expandir escopos (só admin) */}
                {isAdmin && (
                  <button
                    onClick={() => setExpanded(isExp ? null : u.id)}
                    style={{
                      backgroundColor: isExp ? 'rgba(184,134,11,0.15)' : '#2a2a2a',
                      border: `1px solid ${isExp ? '#B8860B' : '#444'}`,
                      color: isExp ? '#B8860B' : '#888',
                      borderRadius: '8px', padding: '6px 12px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}
                  >
                    {isExp ? '▲ Fechar' : '⚙️ Escopos'}
                  </button>
                )}
              </div>

              {/* ── Painel de escopos (expandido) ──────────────────────── */}
              {isExp && isAdmin && (
                <div style={{
                  borderTop: '1px solid #2a2a2a',
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}>
                  {/* Categorias */}
                  <ScopePanel
                    title="📂 Categorias"
                    description="Admin modera conteúdos dessas categorias"
                    color="#22C55E"
                    items={u.scopes.categories.map(id => ({
                      id,
                      label: categories.find(c => c.id === id)?.name ?? id,
                    }))}
                    options={categories
                      .filter(c => !u.scopes.categories.includes(c.id))
                      .map(c => ({ value: c.id, label: c.name }))}
                    onAdd={val => addScope(u.id, 'category', val)}
                    onRemove={val => removeScope(u.id, 'category', val)}
                    loading={loading}
                    adminId={u.id}
                    scopeType="category"
                  />

                  {/* Criadores */}
                  <ScopePanel
                    title="👤 Criadores"
                    description="Admin modera uploads dessas pessoas"
                    color="#60A5FA"
                    items={u.scopes.creators.map(id => ({
                      id,
                      label: allCreators.find(c => c.id === id)?.full_name ?? id,
                    }))}
                    options={allCreators
                      .filter(c => !u.scopes.creators.includes(c.id))
                      .map(c => ({ value: c.id, label: c.full_name ?? c.id }))}
                    onAdd={val => addScope(u.id, 'creator', val)}
                    onRemove={val => removeScope(u.id, 'creator', val)}
                    loading={loading}
                    adminId={u.id}
                    scopeType="creator"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}

// ── ScopePanel ───────────────────────────────────────────────────────────────
function ScopePanel({
  title, description, color, items, options,
  onAdd, onRemove, loading, adminId, scopeType,
}: {
  title: string
  description: string
  color: string
  items: { id: string; label: string | null }[]
  options: { value: string; label: string | null }[]
  onAdd: (val: string) => void
  onRemove: (val: string) => void
  loading: string
  adminId: string
  scopeType: string
}) {
  const [selected, setSelected] = useState('')

  return (
    <div>
      <p style={{ color, fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
        {title}
      </p>
      <p style={{ color: '#555', fontSize: '12px', marginBottom: '12px' }}>
        {description}
      </p>

      {/* Items com escopo */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {items.length === 0 ? (
          <span style={{ color: '#444', fontSize: '12px', fontStyle: 'italic' }}>
            Nenhum escopo definido
          </span>
        ) : items.map(item => (
          <span key={item.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: `${color}15`,
            border: `1px solid ${color}44`,
            color, fontSize: '12px', fontWeight: '600',
            padding: '4px 10px', borderRadius: '9999px',
          }}>
            {item.label}
            <button
              onClick={() => onRemove(item.id)}
              disabled={!!loading}
              style={{
                backgroundColor: 'transparent', border: 'none',
                color, cursor: 'pointer', fontSize: '14px', padding: '0',
                lineHeight: 1, opacity: 0.7,
              }}
              title="Remover"
            >×</button>
          </span>
        ))}
      </div>

      {/* Adicionar */}
      {options.length > 0 && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{
              flex: 1, backgroundColor: '#111', border: '1px solid #333',
              color: '#CCC', borderRadius: '8px', padding: '6px 10px',
              fontSize: '12px', cursor: 'pointer',
            }}
          >
            <option value="">Selecionar...</option>
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => { if (selected) { onAdd(selected); setSelected('') } }}
            disabled={!selected || loading === `add-${adminId}-${scopeType}-${selected}`}
            style={{
              backgroundColor: selected ? color : '#333',
              border: 'none', color: 'white', borderRadius: '8px',
              padding: '6px 14px', fontSize: '12px', fontWeight: '700',
              cursor: selected ? 'pointer' : 'not-allowed',
              opacity: selected ? 1 : 0.5, transition: 'all 0.15s',
            }}
          >
            + Add
          </button>
        </div>
      )}
    </div>
  )
}

// ── ScopeBadge ───────────────────────────────────────────────────────────────
function ScopeBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: '11px', color, backgroundColor: `${color}15`,
      border: `1px solid ${color}33`, padding: '2px 8px',
      borderRadius: '9999px', fontWeight: '600',
    }}>
      {label}
    </span>
  )
}