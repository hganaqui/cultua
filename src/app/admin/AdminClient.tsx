// ✅ AdminClient.tsx (CORRIGIDO - COPIAR COMPLETO)

'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import { getContentTags } from '@/types' // ✅ ADICIONADO
import type { Content } from '@/types'

const DS = DESIGN_SYSTEM

const SUCCESS_COLOR = '#6B7F6B'
const ERROR_COLOR = '#C84C3C'

type Tab = 'pending' | 'approved' | 'rejected'
type SortBy = 'date' | 'name' | 'author'

interface Filters {
  searchTerm: string
  category: string
  author: string
  sortBy: SortBy
}

export default function AdminClient() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [contents, setContents] = useState<Content[]>([])
  const [tab, setTab] = useState<Tab>('pending')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    searchTerm: '', category: '', author: '', sortBy: 'date',
  })

  const loadContents = useCallback(async (status: Tab) => {
    setTab(status)
    setFilters({ searchTerm: '', category: '', author: '', sortBy: 'date' })
    setLoading(true)
    try {
      const { data } = await supabase
        .from('contents')
        .select(`*, category:categories(name,slug,color,icon), creator:profiles(full_name), content_tags(tag:tags(id, name, slug, color, icon))`)
        .eq('status', status === 'approved' ? 'published' : status) // ✅ CORRIGIDO
        .order('created_at', { ascending: false })

      const processed = (data as any[])?.map(item => ({
        ...item,
        content_tags: item.content_tags ?? [], // ✅ CORRIGIDO
      })) ?? []

      setContents(prev => {
        const outros = prev.filter(c => c.status !== status)
        return [...outros, ...(processed as Content[])]
      })
    } catch (err) {
      console.error('[AdminClient] loadContents:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/auth/login'); return }

        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', user.id).single()

        if (!profile || !['user', 'admin', 'superadmin'].includes(profile.role)) {
          router.push('/'); return
        }

        setAuthorized(true)
        setLoading(true)

        try {
          const [pendRes, appRes, rejRes] = await Promise.all([
            supabase.from('contents').select(`*, category:categories(name,slug,color,icon), creator:profiles(full_name), content_tags(tag:tags(id, name, slug, color, icon))`).eq('status', 'pending').order('created_at', { ascending: false }),
            supabase.from('contents').select(`*, category:categories(name,slug,color,icon), creator:profiles(full_name), content_tags(tag:tags(id, name, slug, color, icon))`).eq('status', 'published').order('created_at', { ascending: false }), // ✅ 'approved' → 'published'
            supabase.from('contents').select(`*, category:categories(name,slug,color,icon), creator:profiles(full_name), content_tags(tag:tags(id, name, slug, color, icon))`).eq('status', 'rejected').order('created_at', { ascending: false }),
          ])


          const proc = (data: any[]) =>           // ✅ removido o parâmetro 'status'
            (data ?? []).map(item => ({
              ...item,
              // ✅ NÃO sobrescrever item.status — usar o que veio do banco ('published', 'pending', 'rejected')
              content_tags: item.content_tags ?? [],
            }))

          setContents([
            ...proc(pendRes.data as any[]),       // ✅ sem segundo argumento
            ...proc(appRes.data as any[]),
            ...proc(rejRes.data as any[]),
          ])
          setTab('pending')
        } finally {
          setLoading(false)
        }
      } catch (err) {
        console.error('[AdminClient] checkAuth:', err)
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  const filteredContents = useMemo(() => {
    // ✅ tab 'approved' corresponde a status 'published' no banco
    const statusMap: Record<Tab, string> = {
      pending: 'pending',
      approved: 'published',  // ✅ mapeamento correto
      rejected: 'rejected',
    }
    let result = contents.filter(c => c.status === statusMap[tab])

    // ... resto do useMemo permanece igual
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      )
    }
    if (filters.category) result = result.filter(c => (c.category as any)?.name === filters.category)
    if (filters.author) result = result.filter(c => (c.creator as any)?.full_name === filters.author)

    if (filters.sortBy === 'date') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (filters.sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title))
    else if (filters.sortBy === 'author') result.sort((a, b) => ((a.creator as any)?.full_name ?? '').localeCompare((b.creator as any)?.full_name ?? ''))

    return result
  }, [contents, filters, tab])

const statusMap: Record<Tab, string> = {
  pending:  'pending',
  approved: 'published',
  rejected: 'rejected',
}

const categoriesList = useMemo(() =>
  [...new Set(
    contents
      .filter(c => c.status === statusMap[tab])  // ✅
      .map(c => (c.category as any)?.name)
      .filter((x): x is string => !!x)
  )].sort(),
  [contents, tab]
)

const authorsList = useMemo(() =>
  [...new Set(
    contents
      .filter(c => c.status === statusMap[tab])  // ✅
      .map(c => (c.creator as any)?.full_name)
      .filter((x): x is string => !!x)
  )].sort(),
  [contents, tab]
)

  async function handleAction(id: string, action: 'published' | 'rejected') { // ✅ 'approved' → 'published'
    setActionId(id)
    const content = contents.find(c => c.id === id)
    if (!content) { setActionId(null); return }

    await supabase.from('contents').update({ status: action }).eq('id', id)
    await supabase.from('notifications').insert({
      user_id: content.creator_id,
      type: action === 'published' ? 'content_approved' : 'content_rejected', // ✅
      title: action === 'published' ? 'Seu conteúdo foi aprovado!' : 'Seu conteúdo foi rejeitado',
      message: action === 'published'
        ? `${content.title} está publicado e visível para todos.`
        : `${content.title} não foi aprovado. Verifique e tente novamente.`,
      read: false, metadata: { content_id: id },
    })

    setContents(prev => prev.filter(c => c.id !== id))
    setActionId(null)
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    await supabase.from('contents').update({ is_featured: !current }).eq('id', id)
    setContents(prev => prev.map(c => c.id === id ? { ...c, is_featured: !current } : c))
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que quer remover esse conteúdo?')) return
    setDeleting(true); setDeleteId(id)
    try {
      const content = contents.find(c => c.id === id)
      if (content?.url_media || content?.url_thumb) {
        await fetch('/api/admin/delete-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url_media: content.url_media, url_thumb: content.url_thumb }),
        })
      }
      await supabase.from('contents').delete().eq('id', id)
      setContents(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Erro ao deletar conteúdo'); console.error(err)
    } finally {
      setDeleting(false); setDeleteId(null)
    }
  }

  if (!authorized) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary }}>
      Verificando permissões...
    </div>
  )

  const filterSelectStyle: React.CSSProperties = {
    backgroundColor: DS.colors.bg.primary,
    border: `1.5px solid ${DS.colors.neutral.medium}`,
    borderRadius: DS.borderRadius.md, padding: '10px 14px',
    fontFamily: DS.typography.fontFamily.body,
    color: DS.colors.text.primary, fontSize: '14px',
    cursor: 'pointer', outline: 'none',
  }

  return (
    <main style={{ maxWidth: '1200px', width: '100%', boxSizing: 'border-box' as const, margin: '0 auto', padding: '16px', overflowX: 'hidden' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '12px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: '28px', fontWeight: DS.typography.fontWeight.bold, color: DS.colors.text.primary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            🛡️ Painel de Curadoria
          </h1>
          <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '14px' }}>
            Aprove, rejeite e gerencie conteúdos da plataforma
          </p>
        </div>
        <a href="/admin/upload" style={{
          backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
          textDecoration: 'none', padding: '10px 20px',
          borderRadius: DS.borderRadius.lg, fontFamily: DS.typography.fontFamily.body,
          fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold,
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          whiteSpace: 'nowrap' as const, boxShadow: '0 4px 16px rgba(15,61,46,0.2)',
        }}>
          + Novo Upload
        </a>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${DS.colors.neutral.light}`, paddingBottom: '12px', overflowX: 'auto' as const }}>
        {([
          { key: 'pending', label: 'Pendentes', count: contents.filter(c => c.status === 'pending').length },
          { key: 'approved', label: 'Aprovados', count: contents.filter(c => c.status === 'published').length }, // ✅ 'published' não 'approved'
          { key: 'rejected', label: 'Rejeitados', count: contents.filter(c => c.status === 'rejected').length },
        ] as { key: Tab; label: string; count: number }[]).map(t => (
          <button key={t.key} onClick={() => loadContents(t.key)} style={{
            padding: '8px 16px', borderRadius: DS.borderRadius.md, border: 'none',
            fontFamily: DS.typography.fontFamily.body, fontSize: '13px',
            fontWeight: DS.typography.fontWeight.semibold, cursor: 'pointer',
            backgroundColor: tab === t.key ? DS.colors.primary.main : 'transparent',
            color: tab === t.key ? '#FFFFFF' : DS.colors.text.secondary,
            transition: DS.transitions.fast, display: 'flex', alignItems: 'center',
            gap: '6px', whiteSpace: 'nowrap' as const, flexShrink: 0,
          }}>
            {t.label}
            <span style={{ backgroundColor: tab === t.key ? 'rgba(0,0,0,0.3)' : DS.colors.neutral.medium, borderRadius: DS.borderRadius.full, padding: '2px 8px', fontSize: '11px', fontWeight: DS.typography.fontWeight.bold }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      {!loading && contents.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px', backgroundColor: DS.colors.bg.secondary, padding: '16px', borderRadius: DS.borderRadius.lg, border: `1px solid ${DS.colors.neutral.light}` }}>
          <input type="text" placeholder="Buscar por título..." value={filters.searchTerm}
            onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
            style={filterSelectStyle}
            onFocus={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
            onBlur={e => (e.currentTarget.style.borderColor = DS.colors.neutral.medium)}
          />
          <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} style={filterSelectStyle}>
            <option value="">Todas as categorias</option>
            {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={filters.author} onChange={e => setFilters(f => ({ ...f, author: e.target.value }))} style={filterSelectStyle}>
            <option value="">Todos os autores</option>
            {authorsList.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as SortBy }))} style={filterSelectStyle}>
            <option value="date">Mais recentes</option>
            <option value="name">Título A-Z</option>
            <option value="author">Autor A-Z</option>
          </select>
          <button
            onClick={() => setFilters({ searchTerm: '', category: '', author: '', sortBy: 'date' })}
            style={{ ...filterSelectStyle, cursor: 'pointer', fontWeight: DS.typography.fontWeight.semibold }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.colors.primary.main; e.currentTarget.style.color = DS.colors.primary.main }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.colors.neutral.medium; e.currentTarget.style.color = DS.colors.text.primary }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      {!loading && contents.length > 0 && (
        <div style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px', marginBottom: '12px' }}>
          {filteredContents.length} resultado{filteredContents.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, textAlign: 'center', padding: '48px' }}>
          Carregando...
        </div>
      ) : filteredContents.length === 0 ? (
        <div style={{ backgroundColor: DS.colors.bg.secondary, borderRadius: DS.borderRadius.xl, padding: '56px', textAlign: 'center', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, border: `1px solid ${DS.colors.neutral.light}` }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {tab === 'pending' ? '⏳' : tab === 'approved' ? '✅' : '❌'}
          </div>
          <p>Nenhum conteúdo {tab === 'pending' ? 'aguardando aprovação' : tab === 'approved' ? 'aprovado' : 'rejeitado'}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {filteredContents.map(item => (
            <div key={item.id}
              style={{ backgroundColor: DS.colors.bg.secondary, borderRadius: DS.borderRadius.xl, padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '16px', border: `1px solid ${DS.colors.neutral.light}`, boxShadow: DS.shadows.sm, transition: DS.transitions.fast }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${DS.colors.primary.main}44`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
            >
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, width: '100%', minWidth: 0 }}>

                {/* Thumb */}
                <div style={{ width: '100px', height: '64px', flexShrink: 0, backgroundColor: DS.colors.neutral.light, borderRadius: DS.borderRadius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', backgroundImage: item.url_thumb ? `url(${item.url_thumb})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden' }}>
                  {!item.url_thumb && ((item.category as any)?.icon ?? '📄')}
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '11px', fontWeight: DS.typography.fontWeight.semibold, color: (item.category as any)?.color ?? DS.colors.primary.accent, backgroundColor: `${(item.category as any)?.color ?? DS.colors.primary.accent}20`, padding: '2px 8px', borderRadius: DS.borderRadius.full }}>
                      {(item.category as any)?.icon} {(item.category as any)?.name}
                    </span>
                    <span style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '11px', color: DS.colors.text.secondary, backgroundColor: DS.colors.neutral.light, padding: '2px 8px', borderRadius: DS.borderRadius.sm }}>
                      {item.type.toUpperCase()}
                    </span>
                    {item.is_featured && (
                      <span style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '11px', fontWeight: DS.typography.fontWeight.semibold, color: DS.colors.primary.accent, backgroundColor: `${DS.colors.primary.accent}20`, padding: '2px 8px', borderRadius: DS.borderRadius.full }}>
                        ✦ Destaque
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: DS.typography.fontFamily.heading, color: DS.colors.text.primary, fontSize: '15px', fontWeight: DS.typography.fontWeight.bold, margin: 0, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '13px', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}

                  <div style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px' }}>
                    {(item.creator as any)?.full_name ?? 'Desconhecido'} · {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    {item.duration && ` · ${item.duration}`}
                  </div>

                  {item.content_tags && item.content_tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                      {getContentTags(item.content_tags).slice(0, 4).map((tag: any) => (
                        <span key={tag.id} style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '10px', fontWeight: DS.typography.fontWeight.semibold, backgroundColor: `${tag.color}25`, color: tag.color, padding: '2px 8px', borderRadius: DS.borderRadius.full, border: `1px solid ${tag.color}35` }}>
                          {tag.icon} {tag.name}
                        </span>
                      ))}
                      {getContentTags(item.content_tags).length > 4 && (
                        <span style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '10px', backgroundColor: DS.colors.neutral.light, color: DS.colors.text.muted, padding: '2px 8px', borderRadius: DS.borderRadius.full }}>
                          +{getContentTags(item.content_tags).length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {tab === 'pending' && (
                  <>
                    <button onClick={() => handleAction(item.id, 'published')} disabled={actionId === item.id}
                      style={{ backgroundColor: SUCCESS_COLOR, color: '#FFFFFF', border: 'none', borderRadius: DS.borderRadius.md, padding: '9px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: actionId === item.id ? 'not-allowed' : 'pointer', opacity: actionId === item.id ? 0.6 : 1, transition: DS.transitions.fast }}>
                      {actionId === item.id ? '...' : '✓ Aprovar'}
                    </button>
                    <button onClick={() => handleAction(item.id, 'rejected')} disabled={actionId === item.id}
                      style={{ backgroundColor: `${ERROR_COLOR}12`, color: ERROR_COLOR, border: `1px solid ${ERROR_COLOR}30`, borderRadius: DS.borderRadius.md, padding: '9px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: actionId === item.id ? 'not-allowed' : 'pointer', opacity: actionId === item.id ? 0.6 : 1, transition: DS.transitions.fast }}>
                      {actionId === item.id ? '...' : '✕ Rejeitar'}
                    </button>
                  </>
                )}
                {tab === 'approved' && (
                  <>
                    <button onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                      style={{ backgroundColor: item.is_featured ? `${DS.colors.primary.main}18` : DS.colors.bg.primary, color: item.is_featured ? DS.colors.primary.main : DS.colors.text.secondary, border: `1.5px solid ${item.is_featured ? DS.colors.primary.main : DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, padding: '9px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: 'pointer', transition: DS.transitions.fast }}>
                      {item.is_featured ? '✦ Destaque' : '✦ Destacar'}
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deleteId === item.id && deleting}
                      style={{ backgroundColor: `${ERROR_COLOR}12`, color: ERROR_COLOR, border: `1px solid ${ERROR_COLOR}30`, borderRadius: DS.borderRadius.md, padding: '9px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: deleteId === item.id && deleting ? 'not-allowed' : 'pointer', opacity: deleteId === item.id && deleting ? 0.6 : 1, transition: DS.transitions.fast }}>
                      {deleteId === item.id && deleting ? '...' : '🗑️ Remover'}
                    </button>
                  </>
                )}
                {tab === 'rejected' && (
                  <>
                    <button onClick={() => handleAction(item.id, 'published')}
                      style={{ backgroundColor: DS.colors.bg.primary, color: DS.colors.text.secondary, border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.md, padding: '9px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: 'pointer', transition: DS.transitions.fast }}>
                      ↩ Restaurar
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deleteId === item.id && deleting}
                      style={{ backgroundColor: `${ERROR_COLOR}12`, color: ERROR_COLOR, border: `1px solid ${ERROR_COLOR}30`, borderRadius: DS.borderRadius.md, padding: '9px 12px', fontFamily: DS.typography.fontFamily.body, fontSize: '13px', fontWeight: DS.typography.fontWeight.semibold, cursor: deleteId === item.id && deleting ? 'not-allowed' : 'pointer', opacity: deleteId === item.id && deleting ? 0.6 : 1, transition: DS.transitions.fast }}>
                      {deleteId === item.id && deleting ? '...' : '🗑️ Remover'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}