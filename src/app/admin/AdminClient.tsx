'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Content } from '@/types'

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
    searchTerm: '',
    category: '',
    author: '',
    sortBy: 'date',
  })

  // ✅ MELHORADO: useCallback para persistir dados
  const loadContents = useCallback(async (status: Tab) => {
    setLoading(true)
    setFilters({ searchTerm: '', category: '', author: '', sortBy: 'date' })
    setTab(status) // ✅ NOVO: atualiza a aba

    const { data } = await supabase
      .from('contents')
      .select(`*, category:categories(name, slug, color, icon), creator:profiles(full_name)`)
      .eq('status', status)
      .order('created_at', { ascending: false })

    setContents((data as Content[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['user', 'admin', 'superadmin'].includes(profile.role)) {
        router.push('/')
        return
      }
      setAuthorized(true)
      loadContents('pending')
    }
    checkAuth()
  }, [router, loadContents])

  const filteredContents = useMemo(() => {
    let result = [...contents]

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      )
    }

    if (filters.category) {
      result = result.filter(c => (c.category as any)?.name === filters.category)
    }

    if (filters.author) {
      result = result.filter(c => (c.creator as any)?.full_name === filters.author)
    }

    if (filters.sortBy === 'date') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (filters.sortBy === 'author') {
      result.sort((a, b) => {
        const authorA = (a.creator as any)?.full_name ?? ''
        const authorB = (b.creator as any)?.full_name ?? ''
        return authorA.localeCompare(authorB)
      })
    }

    return result
  }, [contents, filters])

  const categoriesList = useMemo(
    () => [...new Set(contents.map(c => (c.category as any)?.name).filter((x): x is string => !!x))].sort(),
    [contents]
  )

  const authorsList = useMemo(
    () => [...new Set(contents.map(c => (c.creator as any)?.full_name).filter((x): x is string => !!x))].sort(),
    [contents]
  )

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

  async function handleDelete(id: string) {
    if (!confirm('⚠️ Tem certeza que quer remover esse conteúdo? Esta ação é irreversível.')) {
      return
    }

    setDeleting(true)
    setDeleteId(id)

    try {
      const content = contents.find(c => c.id === id)
      if (content?.url_media || content?.url_thumb) {
        await fetch('/api/admin/delete-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url_media: content.url_media,
            url_thumb: content.url_thumb,
          }),
        })
      }

      await supabase.from('contents').delete().eq('id', id)
      setContents(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Erro ao deletar conteúdo')
      console.error(err)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (!authorized) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#666' }}>
      Verificando permissões...
    </div>
  )

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            🛡️ Painel de Curadoria
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Aprove, rejeite e gerencie conteúdos da plataforma
          </p>
        </div>

        <a href="/admin/upload" style={{
          backgroundColor: '#B8860B',
          color: 'white',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '700',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
        }}>
          📤 Novo Upload
        </a>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #2D2D2D', paddingBottom: '12px' }}>
        {([
          { key: 'pending', label: '⏳ Pendentes', count: contents.filter(c => c.status === 'pending').length },
          { key: 'approved', label: '✅ Aprovados', count: contents.filter(c => c.status === 'approved').length },
          { key: 'rejected', label: '❌ Rejeitados', count: contents.filter(c => c.status === 'rejected').length },
        ] as { key: Tab; label: string; count: number }[]).map(t => (
          <button
            key={t.key}
            onClick={() => loadContents(t.key)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              backgroundColor: tab === t.key ? '#B8860B' : 'transparent',
              color: tab === t.key ? 'white' : '#999',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {t.label}
            <span style={{
              backgroundColor: tab === t.key ? 'rgba(0,0,0,0.3)' : '#2D2D2D',
              borderRadius: '9999px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: '700',
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {!loading && contents.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
          backgroundColor: '#1A1A1A',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #2D2D2D',
        }}>
          <input
            type="text"
            placeholder="🔍 Buscar por título..."
            value={filters.searchTerm}
            onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #3D3D3D',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FFF',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#B8860B')}
            onBlur={e => (e.target.style.borderColor = '#3D3D3D')}
          />

          <select
            value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #3D3D3D',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FFF',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#B8860B')}
            onBlur={e => (e.target.style.borderColor = '#3D3D3D')}
          >
            <option value="">📁 Todas as categorias</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat ?? ''}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.author}
            onChange={e => setFilters(f => ({ ...f, author: e.target.value }))}
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #3D3D3D',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FFF',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#B8860B')}
            onBlur={e => (e.target.style.borderColor = '#3D3D3D')}
          >
            <option value="">👤 Todos os autores</option>
            {authorsList.map(author => (
              <option key={author} value={author ?? ''}>
                {author}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as SortBy }))}
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #3D3D3D',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FFF',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#B8860B')}
            onBlur={e => (e.target.style.borderColor = '#3D3D3D')}
          >
            <option value="date">📅 Mais recentes</option>
            <option value="name">🔤 Título (A-Z)</option>
            <option value="author">👤 Autor (A-Z)</option>
          </select>

          <button
            onClick={() => setFilters({ searchTerm: '', category: '', author: '', sortBy: 'date' })}
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #3D3D3D',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#999',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#B8860B'
              e.currentTarget.style.color = '#B8860B'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#3D3D3D'
              e.currentTarget.style.color = '#999'
            }}
          >
            🔄 Limpar
          </button>
        </div>
      )}

      {!loading && contents.length > 0 && (
        <div style={{ color: '#555', fontSize: '12px', marginBottom: '12px' }}>
          {filteredContents.length} resultado{filteredContents.length !== 1 ? 's' : ''} encontrado{filteredContents.length !== 1 ? 's' : ''}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#666', textAlign: 'center', padding: '40px' }}>⏳ Carregando...</div>
      ) : filteredContents.length === 0 ? (
        <div style={{
          backgroundColor: '#222', borderRadius: '16px', padding: '48px',
          textAlign: 'center', color: '#555',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>
            {tab === 'pending' ? '🎉' : tab === 'approved' ? '📭' : '🗑️'}
          </div>
          <p>{filters.searchTerm || filters.category || filters.author ? 'Nenhum resultado com esses filtros.' : `Nenhum conteúdo ${tab === 'pending' ? 'aguardando aprovação' : tab === 'approved' ? 'aprovado' : 'rejeitado'}.`}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredContents.map(item => (
            <div key={item.id} style={{
              backgroundColor: '#222', borderRadius: '14px', padding: '20px',
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              border: '1px solid #2D2D2D',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3D3D3D')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2D2D2D')}
            >
              <div style={{
                width: '100px', height: '64px', flexShrink: 0,
                backgroundColor: '#1A1A1A', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                backgroundImage: item.url_thumb ? `url(${item.url_thumb})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
              }}>
                {!item.url_thumb && ((item.category as any)?.icon ?? '🎵')}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600',
                    color: (item.category as any)?.color ?? '#B8860B',
                    backgroundColor: `${(item.category as any)?.color ?? '#B8860B'}20`,
                    padding: '2px 8px', borderRadius: '9999px',
                  }}>
                    {(item.category as any)?.icon} {(item.category as any)?.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#555', backgroundColor: '#2D2D2D', padding: '2px 8px', borderRadius: '4px' }}>
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
                  👤 {(item.creator as any)?.full_name ?? 'Desconhecido'} · 📅 {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  {item.duration && ` · ⏱️ ${item.duration}`}
                </div>
              </div>

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
                        opacity: actionId === item.id ? 0.6 : 1,
                        transition: 'all 0.2s',
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
                        opacity: actionId === item.id ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      ❌ Rejeitar
                    </button>
                  </>
                )}

                {tab === 'approved' && (
                  <>
                    <button
                      onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                      style={{
                        backgroundColor: item.is_featured ? 'rgba(184,134,11,0.2)' : '#2D2D2D',
                        color: item.is_featured ? '#B8860B' : '#999',
                        border: `1px solid ${item.is_featured ? 'rgba(184,134,11,0.4)' : '#3D3D3D'}`,
                        borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      {item.is_featured ? '✨ Destaque' : '☆ Destacar'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteId === item.id && deleting}
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                        opacity: deleteId === item.id && deleting ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      🗑️ Remover
                    </button>
                  </>
                )}

                {tab === 'rejected' && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      style={{
                        backgroundColor: '#2D2D2D', color: '#999', border: '1px solid #3D3D3D',
                        borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      ↩️ Restaurar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteId === item.id && deleting}
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                        opacity: deleteId === item.id && deleting ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      🗑️ Remover
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