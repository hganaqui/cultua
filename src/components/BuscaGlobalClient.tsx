'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface SearchResult {
  id: string
  title: string
  type: 'video' | 'audio' | 'text'
  url_thumb: string | null
  duration: string | null
  category_name: string
  tags: Tag[]
}

function TypeIcon({ type }: { type: string }) {
  const map: Record<string, string> = {
    video: '🎬', audio: '🎵', text: '📄',
  }
  return <span>{map[type] ?? '📁'}</span>
}

export default function BuscaGlobalClient() {
  const [isOpen, setIsOpen]           = useState(false)
  const [query, setQuery]             = useState('')
  const [results, setResults]         = useState<SearchResult[]>([])
  const [loading, setLoading]         = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef    = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setSelectedIndex(0)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  /* ── Atalhos de teclado ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open()
      }
      if (e.key === 'Escape' && isOpen) close()
      if (!isOpen || results.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % results.length)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + results.length) % results.length)
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        window.location.href = `/content/${results[selectedIndex].id}`
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, results, selectedIndex, open, close])

  /* ── Fecha ao clicar fora ── */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, close])

  /* ── Busca ── */
  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contents')
        .select(`
          id, title, type, url_thumb, duration,
          category:categories(name),
          tags:content_tags(tag:tags(*))
        `)
        .eq('status', 'approved')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(10)

      if (error) throw error

      setResults((data as any[]).map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        url_thumb: item.url_thumb,
        duration: item.duration,
        category_name: Array.isArray(item.category)
          ? item.category[0]?.name ?? 'Sem categoria'
          : item.category?.name ?? 'Sem categoria',
        tags: (item.tags ?? []).map((ct: any) => ct.tag).filter(Boolean),
      })))
      setSelectedIndex(0)
    } catch (err) {
      console.error('[BuscaGlobal]', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    performSearch(value)
  }

  return (
    <>
      {/* Botão de busca */}
      <button
        onClick={open}
        aria-label="Abrir busca (Ctrl+K)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 14px',
          backgroundColor: DS.colors.bg.primary,
          color: DS.colors.text.secondary,
          border: `1.5px solid ${DS.colors.neutral.medium}`,
          borderRadius: DS.borderRadius.lg,
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.medium,
          transition: DS.transitions.fast,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = DS.colors.primary.main
          e.currentTarget.style.color = DS.colors.text.primary
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = DS.colors.neutral.medium
          e.currentTarget.style.color = DS.colors.text.secondary
        }}
      >
        🔍 Buscar...
        <kbd style={{
          marginLeft: '8px',
          fontSize: '11px',
          fontFamily: DS.typography.fontFamily.body,
          backgroundColor: DS.colors.neutral.light,
          color: DS.colors.text.muted,
          padding: '2px 6px',
          borderRadius: DS.borderRadius.sm,
          border: `1px solid ${DS.colors.neutral.medium}`,
        }}>
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Busca global"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 61, 46, 0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '80px',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: '90%',
              maxWidth: '600px',
              backgroundColor: DS.colors.bg.secondary,
              borderRadius: DS.borderRadius.xl,
              border: `1px solid ${DS.colors.neutral.medium}`,
              boxShadow: DS.shadows['2xl'],
              overflow: 'hidden',
              animation: 'busca-slide-in 0.2s ease-out',
            }}
          >
            {/* Input */}
            <div style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${DS.colors.neutral.light}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="O que você precisa hoje?"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: DS.colors.text.primary,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontFamily: DS.typography.fontFamily.body,
                  padding: '6px 0',
                }}
              />
              <button
                onClick={close}
                aria-label="Fechar busca"
                style={{
                  backgroundColor: DS.colors.neutral.light,
                  border: 'none',
                  borderRadius: DS.borderRadius.sm,
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontFamily: DS.typography.fontFamily.body,
                  color: DS.colors.text.secondary,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                ESC
              </button>
            </div>

            {/* Resultados */}
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {loading && (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: DS.colors.text.secondary,
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '14px',
                }}>
                  <span className="animate-spin" style={{ display: 'inline-block', marginRight: '8px' }}>⏳</span>
                  Buscando...
                </div>
              )}

              {!loading && !query && (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: DS.colors.text.secondary,
                }}>
                  <p style={{
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px',
                    margin: '0 0 8px',
                  }}>
                    Digite para começar a buscar
                  </p>
                  <p style={{
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '12px',
                    color: DS.colors.text.muted,
                    margin: 0,
                  }}>
                    ↑ ↓ para navegar  •  Enter para abrir  •  Esc para fechar
                  </p>
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  fontFamily: DS.typography.fontFamily.body,
                  color: DS.colors.text.secondary,
                  fontSize: '14px',
                }}>
                  Nenhum resultado para "<strong>{query}</strong>"
                </div>
              )}

              {!loading && results.map((result, index) => (
                <Link
                  key={result.id}
                  href={`/content/${result.id}`}
                  onClick={close}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: `1px solid ${DS.colors.neutral.light}`,
                    backgroundColor: index === selectedIndex
                      ? 'rgba(15, 61, 46, 0.04)'
                      : 'transparent',
                    textDecoration: 'none',
                    transition: DS.transitions.fast,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(15, 61, 46, 0.04)'
                    setSelectedIndex(index)
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = index === selectedIndex
                      ? 'rgba(15, 61, 46, 0.04)'
                      : 'transparent'
                  }}
                >
                  {/* Thumbnail */}
                  {result.url_thumb ? (
                    <img
                      src={result.url_thumb}
                      alt={result.title}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: DS.borderRadius.md,
                        objectFit: 'cover',
                        flexShrink: 0,
                        backgroundColor: DS.colors.neutral.light,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: DS.borderRadius.md,
                      backgroundColor: DS.colors.neutral.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0,
                    }}>
                      <TypeIcon type={result.type} />
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: DS.typography.fontFamily.heading,
                      fontSize: '14px',
                      fontWeight: DS.typography.fontWeight.semibold,
                      color: DS.colors.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '4px',
                    }}>
                      {result.title}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontFamily: DS.typography.fontFamily.body,
                        backgroundColor: 'rgba(15,61,46,0.08)',
                        color: DS.colors.primary.main,
                        padding: '2px 7px',
                        borderRadius: DS.borderRadius.full,
                        fontWeight: DS.typography.fontWeight.medium,
                      }}>
                        {result.category_name}
                      </span>
                      {result.duration && (
                        <span style={{
                          fontSize: '11px',
                          fontFamily: DS.typography.fontFamily.body,
                          color: DS.colors.text.muted,
                        }}>
                          {result.duration}
                        </span>
                      )}
                      {/* Tags */}
                      {result.tags.slice(0, 2).map(tag => (
                        <span key={tag.id} style={{
                          fontSize: '10px',
                          fontFamily: DS.typography.fontFamily.body,
                          backgroundColor: `${tag.color}25`,
                          color: tag.color,
                          padding: '2px 7px',
                          borderRadius: DS.borderRadius.full,
                          fontWeight: DS.typography.fontWeight.semibold,
                        }}>
                          {tag.icon} {tag.name}
                        </span>
                      ))}
                      {result.tags.length > 2 && (
                        <span style={{
                          fontSize: '10px',
                          fontFamily: DS.typography.fontFamily.body,
                          color: DS.colors.text.muted,
                        }}>
                          +{result.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tipo */}
                  <div style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                  }}>
                    <TypeIcon type={result.type} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Rodapé */}
            {results.length > 0 && (
              <div style={{
                padding: '10px 16px',
                borderTop: `1px solid ${DS.colors.neutral.light}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '11px',
                  color: DS.colors.text.muted,
                }}>
                  {results.length} resultado{results.length > 1 ? 's' : ''}
                </span>
                <span style={{
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '11px',
                  color: DS.colors.text.muted,
                }}>
                  ↑ ↓ Enter
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes busca-slide-in {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>
  )
}