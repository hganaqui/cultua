'use client'

import Image from 'next/image'
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
  const map: Record<string, string> = { video: '🎬', audio: '🎵', text: '📄' }
  return <span>{map[type] ?? '📁'}</span>
}

export default function BuscaGlobalClientMobile() {
  const [isOpen, setIsOpen]   = useState(false)
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef              = useRef<HTMLInputElement>(null)
  const containerRef          = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }, [])

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
        .limit(8)

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
    } catch (err) {
      console.error('[BuscaMobile]', err)
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
      {/* Botão trigger */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 50)
        }}
        aria-label="Abrir busca"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: DS.colors.primary.main,
          fontSize: '20px',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🔍
      </button>

      {/* Overlay fullscreen */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 61, 46, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
        }}>
          {/* Barra de busca */}
          <div
            ref={containerRef}
            style={{
              backgroundColor: DS.colors.bg.secondary,
              padding: '12px 16px',
              borderBottom: `1px solid ${DS.colors.neutral.light}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: DS.shadows.md,
            }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="O que você precisa hoje?"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: DS.colors.bg.primary,
                color: DS.colors.text.primary,
                border: `1.5px solid ${DS.colors.neutral.medium}`,
                borderRadius: DS.borderRadius.lg,
                outline: 'none',
                fontSize: '16px',
                fontFamily: DS.typography.fontFamily.body,
                padding: '10px 14px',
              }}
            />
            <button
              onClick={close}
              aria-label="Fechar busca"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: DS.colors.text.secondary,
                fontSize: '22px',
                cursor: 'pointer',
                padding: '4px',
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Lista de resultados */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: DS.colors.bg.secondary,
          }}>
            {loading && (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '14px',
              }}>
                ⏳ Buscando...
              </div>
            )}

            {!loading && !query && (
              <div style={{
                padding: '40px 16px',
                textAlign: 'center',
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '14px',
              }}>
                Digite para buscar conteúdo
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div style={{
                padding: '40px 16px',
                textAlign: 'center',
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '14px',
              }}>
                Nenhum resultado para "<strong>{query}</strong>"
              </div>
            )}

            {!loading && results.map(result => (
              <Link
                key={result.id}
                href={`/content/${result.id}`}
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderBottom: `1px solid ${DS.colors.neutral.light}`,
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  transition: DS.transitions.fast,
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(15,61,46,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Thumb */}
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
                    marginBottom: '5px',
                  }}>
                    {result.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    {/* Tags com SVGs */}
                    {result.tags.slice(0, 1).map(tag => (
                      <span key={tag.id} style={{
                        fontSize: '10px',
                        fontFamily: DS.typography.fontFamily.body,
                        backgroundColor: `${tag.color}22`,
                        color: tag.text_color || tag.color,
                        padding: '2px 7px',
                        borderRadius: DS.borderRadius.full,
                        fontWeight: DS.typography.fontWeight.semibold,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}>
                        <Image
                          src={tag.icon}
                          alt={tag.name}
                          width={10}
                          height={10}
                          style={{ objectFit: 'contain' }}
                        />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}