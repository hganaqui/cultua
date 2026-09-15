'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Content } from '@/types'

const DS = DESIGN_SYSTEM

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

  const loadContents = useCallback(async (status: Tab) => {
    setTab(status)
    setFilters({ searchTerm: '', category: '', author: '', sortBy: 'date' })
    setLoading(true)

    try {
      const { data } = await supabase
        .from('contents')
        .select(`
          *,
          category:categories(name, slug, color, icon),
          creator:profiles(full_name),
          tags:content_tags(tag:tags(*))
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })

      const processedData = (data as any[])?.map(item => ({
        ...item,
        tags: item.tags?.map((ct: any) => ct.tag).filter(Boolean) || []
      })) || []

      setContents(prev => {
        const outros = prev.filter(c => c.status !== status)
        const novos = (processedData as Content[]) ?? []
        return [...outros, ...novos]
      })
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }, [])

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

        if (!profile || !['user', 'admin', 'superadmin'].includes(profile.role)) {
          router.push('/')
          return
        }

        setAuthorized(true)

        setLoading(true)
        try {
          const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
            supabase
              .from('contents')
              .select(`
                *,
                category:categories(name, slug, color, icon),
                creator:profiles(full_name),
                tags:content_tags(tag:tags(*))
              `)
              .eq('status', 'pending')
              .order('created_at', { ascending: false }),
            supabase
              .from('contents')
              .select(`
                *,
                category:categories(name, slug, color, icon),
                creator:profiles(full_name),
                tags:content_tags(tag:tags(*))
              `)
              .eq('status', 'approved')
              .order('created_at', { ascending: false }),
            supabase
              .from('contents')
              .select(`
                *,
                category:categories(name, slug, color, icon),
                creator:profiles(full_name),
                tags:content_tags(tag:tags(*))
              `)
              .eq('status', 'rejected')
              .order('created_at', { ascending: false }),
          ])

          const processedPending = (pendingRes.data as any[])?.map(item => ({
            ...item,
            status: 'pending' as const,
            tags: item.tags?.map((ct: any) => ct.tag).filter(Boolean) || []
          })) || []

          const processedApproved = (approvedRes.data as any[])?.map(item => ({
            ...item,
            status: 'approved' as const,
            tags: item.tags?.map((ct: any) => ct.tag).filter(Boolean) || []
          })) || []

          const processedRejected = (rejectedRes.data as any[])?.map(item => ({
            ...item,
            status: 'rejected' as const,
            tags: item.tags?.map((ct: any) => ct.tag).filter(Boolean) || []
          })) || []

          const allContents = [
            ...processedPending,
            ...processedApproved,
            ...processedRejected,
          ]

          setContents(allContents)
          setTab('pending')
        } finally {
          setLoading(false)
        }
      } catch (err) {
        console.error('Erro na autenticacao:', err)
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  const filteredContents = useMemo(() => {
    let result = contents.filter(c => c.status === tab)

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
  }, [contents, filters, tab])

  const categoriesList = useMemo(
    () => [...new Set(contents
      .filter(c => c.status === tab)
      .map(c => (c.category as any)?.name)
      .filter((x): x is string => !!x)
    )].sort(),
    [contents, tab]
  )

  const authorsList = useMemo(
    () => [...new Set(contents
      .filter(c => c.status === tab)
      .map(c => (c.creator as any)?.full_name)
      .filter((x): x is string => !!x)
    )].sort(),
    [contents, tab]
  )

  async function handleAction(id: string, action: 'approved' | 'rejected') {
    setActionId(id)

    const content = contents.find(c => c.id === id)
    if (!content) {
      setActionId(null)
      return
    }

    await supabase.from('contents').update({ status: action }).eq('id', id)

    if (action === 'approved') {
      await supabase.from('notifications').insert({
        user_id: content.creator_id,
        type: 'content_approved',
        title: 'Seu conteudo foi aprovado!',
        message: content.title + ' esta publicado e visivel para todos.',
        read: false,
        metadata: { content_id: id },
      })
    } else if (action === 'rejected') {
      await supabase.from('notifications').insert({
        user_id: content.creator_id,
        type: 'content_rejected',
        title: 'Seu conteudo foi rejeitado',
        message: content.title + ' nao foi aprovado. Verifique e tente novamente.',
        read: false,
        metadata: { content_id: id },
      })
    }

    setContents(prev => prev.filter(c => c.id !== id))
    setActionId(null)
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    await supabase.from('contents').update({ is_featured: !current }).eq('id', id)
    setContents(prev => prev.map(c => c.id === id ? { ...c, is_featured: !current } : c))
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que quer remover esse conteudo?')) {
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
      alert('Erro ao deletar conteudo')
      console.error(err)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (!authorized) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: DS.colors.text.secondary }}>
      Verificando permissoes...
    </div>
  )

  return (
    <main style={{
      maxWidth: '1200px',
      width: '100%',
      boxSizing: 'border-box',
      margin: '0 auto',
      padding: '16px',
      overflowX: 'hidden'
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
            Painel de Curadoria
          </h1>
          <p style={{ color: DS.colors.text.secondary, fontSize: '14px' }}>
            Aprove, rejeite e gerencie conteudos da plataforma
          </p>
        </div>

        <a href="/admin/upload" style={{
          backgroundColor: DS.colors.primary.main,
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
          Novo Upload
        </a>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: `1px solid ${DS.colors.neutral.light}`,
        paddingBottom: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        maxWidth: '100%'
      }}>
        {([
          { key: 'pending', label: 'Pendentes', count: contents.filter(c => c.status === 'pending').length },
          { key: 'approved', label: 'Aprovados', count: contents.filter(c => c.status === 'approved').length },
          { key: 'rejected', label: 'Rejeitados', count: contents.filter(c => c.status === 'rejected').length },
        ] as { key: Tab; label: string; count: number }[]).map(t => (
          <button
            key={t.key}
            onClick={() => loadContents(t.key)}
            style={{
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: 'none',
              fontSize: '13px', 
              fontWeight: '600', 
              cursor: 'pointer',
              backgroundColor: tab === t.key ? DS.colors.primary.main : 'transparent',
              color: tab === t.key ? 'white' : DS.colors.text.secondary,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {t.label}
            <span style={{
              backgroundColor: tab === t.key ? 'rgba(0,0,0,0.3)' : DS.colors.neutral.medium,
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
          backgroundColor: DS.colors.bg.secondary,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${DS.colors.neutral.light}`,
        }}>
          <input
            type="text"
            placeholder="Buscar por titulo..."
            value={filters.searchTerm}
            onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
            style={{
              backgroundColor: DS.colors.bg.primary,
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: DS.colors.text.primary,
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
            onBlur={e => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
          />

          <select
            value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            style={{
              backgroundColor: DS.colors.bg.primary,
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: DS.colors.text.primary,
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
            onBlur={e => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
          >
            <option value="">Todas as categorias</option>
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
              backgroundColor: DS.colors.bg.primary,
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: DS.colors.text.primary,
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
            onBlur={e => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
          >
            <option value="">Todos os autores</option>
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
              backgroundColor: DS.colors.bg.primary,
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: DS.colors.text.primary,
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
            onBlur={e => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
          >
            <option value="date">Mais recentes</option>
            <option value="name">Titulo A-Z</option>
            <option value="author">Autor A-Z</option>
          </select>

          <button
            onClick={() => setFilters({ searchTerm: '', category: '', author: '', sortBy: 'date' })}
            style={{
              backgroundColor: DS.colors.bg.primary,
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: DS.colors.text.secondary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = DS.colors.primary.main
              e.currentTarget.style.color = DS.colors.primary.main
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = DS.colors.neutral.light
              e.currentTarget.style.color = DS.colors.text.secondary
            }}
          >
            Limpar
          </button>
        </div>
      )}

      {!loading && contents.length > 0 && (
        <div style={{ color: DS.colors.text.secondary, fontSize: '12px', marginBottom: '12px' }}>
          {filteredContents.length} resultado{filteredContents.length !== 1 ? 's' : ''} encontrado{filteredContents.length !== 1 ? 's' : ''}
        </div>
      )}

      {loading ? (
        <div style={{ color: DS.colors.text.secondary, textAlign: 'center', padding: '40px' }}>Carregando...</div>
      ) : filteredContents.length === 0 ? (
        <div style={{
          backgroundColor: DS.colors.bg.secondary, 
          borderRadius: '16px', 
          padding: '48px',
          textAlign: 'center', 
          color: DS.colors.text.secondary,
        }}>
          <p>Nenhum conteudo {tab === 'pending' ? 'aguardando aprovacao' : tab === 'approved' ? 'aprovado' : 'rejeitado'}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredContents.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: DS.colors.bg.secondary,
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: `1px solid ${DS.colors.neutral.light}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = DS.colors.primary.main + '44')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = DS.colors.neutral.light)}
            >
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                width: '100%',
                minWidth: 0
              }}>
                <div style={{
                  width: '100px', 
                  height: '64px', 
                  flexShrink: 0,
                  backgroundColor: DS.colors.neutral.medium, 
                  borderRadius: '8px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '28px',
                  backgroundImage: item.url_thumb ? `url(${item.url_thumb})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  overflow: 'hidden',
                }}>
                  {!item.url_thumb && ((item.category as any)?.icon ?? '')}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  flex: 1,
                  minWidth: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', 
                      fontWeight: '600',
                      color: (item.category as any)?.color ?? DS.colors.primary.main,
                      backgroundColor: `${(item.category as any)?.color ?? DS.colors.primary.main}20`,
                      padding: '2px 8px', 
                      borderRadius: '9999px',
                    }}>
                      {(item.category as any)?.icon} {(item.category as any)?.name}
                    </span>
                    <span style={{ fontSize: '11px', color: DS.colors.text.secondary, backgroundColor: DS.colors.neutral.medium, padding: '2px 8px', borderRadius: '4px' }}>
                      {item.type.toUpperCase()}
                    </span>
                    {item.is_featured && (
                      <span style={{
                        fontSize: '11px', 
                        fontWeight: '600',
                        color: DS.colors.primary.main, 
                        backgroundColor: DS.colors.primary.main + '15',
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                      }}>
                        Destaque
                      </span>
                    )}
                  </div>

                  <h3 style={{ color: DS.colors.text.dark, fontSize: '15px', fontWeight: '700', margin: '0', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p style={{
                      color: DS.colors.text.secondary, 
                      fontSize: '13px', 
                      lineHeight: 1.5, 
                      margin: '0',
                      display: '-webkit-box', 
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                    }}>
                      {item.description}
                    </p>
                  )}

                  <div style={{ color: DS.colors.text.secondary, fontSize: '12px' }}>
                    {(item.creator as any)?.full_name ?? 'Desconhecido'} . {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    {item.duration && ` . ${item.duration}`}
                  </div>

                  {/* ✅ TAGS */}
                  {item.tags && item.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                    }}>
                      {item.tags.slice(0, 4).map((tag: any) => (
                        <span
                          key={tag.id}
                          style={{
                            fontSize: '10px',
                            backgroundColor: tag.color + '30',
                            color: tag.color,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            border: `1px solid ${tag.color}40`,
                          }}
                        >
                          {tag.icon} {tag.name}
                        </span>
                      ))}
                      {item.tags.length > 4 && (
                        <span
                          style={{
                            fontSize: '10px',
                            backgroundColor: DS.colors.neutral.medium,
                            color: DS.colors.text.secondary,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: '600',
                          }}
                        >
                          +{item.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}>
                {tab === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      disabled={actionId === item.id}
                      style={{
                        backgroundColor: DS.colors.secondary.success, 
                        color: 'white', 
                        border: 'none',
                        borderRadius: '8px', 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        fontWeight: '700', 
                        cursor: actionId === item.id ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        opacity: actionId === item.id ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {actionId === item.id ? '...' : 'Aprovar'}
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'rejected')}
                      disabled={actionId === item.id}
                      style={{
                        backgroundColor: `${DS.colors.secondary.error}15`, 
                        color: DS.colors.secondary.error,
                        border: `1px solid ${DS.colors.secondary.error}30`,
                        borderRadius: '8px', 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        fontWeight: '700', 
                        cursor: actionId === item.id ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        opacity: actionId === item.id ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {actionId === item.id ? '...' : 'Rejeitar'}
                    </button>
                  </>
                )}

                {tab === 'approved' && (
                  <>
                    <button
                      onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                      style={{
                        backgroundColor: item.is_featured ? DS.colors.primary.main + '20' : DS.colors.neutral.charcoal,
                        color: item.is_featured ? DS.colors.primary.main : DS.colors.text.secondary,
                        border: `1px solid ${item.is_featured ? DS.colors.primary.main + '40' : DS.colors.neutral.dark}`,
                        borderRadius: '8px', 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        fontWeight: '700', 
                        cursor: 'pointer', 
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      {item.is_featured ? 'Destaque' : 'Destacar'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteId === item.id && deleting}
                      style={{
                        backgroundColor: `${DS.colors.secondary.error}15`, 
                        color: DS.colors.secondary.error,
                        border: `1px solid ${DS.colors.secondary.error}30`,
                        borderRadius: '8px', 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        fontWeight: '700', 
                        cursor: deleteId === item.id && deleting ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        opacity: deleteId === item.id && deleting ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {deleteId === item.id && deleting ? '...' : 'Remover'}
                    </button>
                  </>
                )}

                {tab === 'rejected' && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      style={{
                        backgroundColor: DS.colors.neutral.charcoal, 
                        color: DS.colors.text.secondary, 
                        border: `1px solid ${DS.colors.neutral.dark}`,
                        borderRadius: '8px', 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        fontWeight: '700', 
                        cursor: 'pointer', 
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteId === item.id && deleting}
                      style={{
                        backgroundColor: `${DS.colors.secondary.error}15`, 
                        color: DS.colors.secondary.error,
                        border: `1px solid ${DS.colors.secondary.error}30`,
                        borderRadius: '8px', 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        fontWeight: '700', 
                        cursor: deleteId === item.id && deleting ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        opacity: deleteId === item.id && deleting ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {deleteId === item.id && deleting ? '...' : 'Remover'}
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