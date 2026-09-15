'use client'

import { useEffect, useRef, useState } from 'react'
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

export default function BuscaGlobalClientMobile() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contents')
        .select(
          `
          id,
          title,
          type,
          url_thumb,
          duration,
          category:categories(name),
          tags:content_tags(tag:tags(*))
        `
        )
        .eq('status', 'approved')
        .or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        )
        .limit(10)

      if (error) throw error

      const formatted = (data as any[]).map((item) => {
        const tagsList: Tag[] = []
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((ct: any) => {
            if (ct.tag) {
              tagsList.push(ct.tag)
            }
          })
        }

        return {
          id: item.id,
          title: item.title,
          type: item.type,
          url_thumb: item.url_thumb,
          duration: item.duration,
          category_name: Array.isArray(item.category)
            ? item.category[0]?.name ?? 'Sem categoria'
            : item.category?.name ?? 'Sem categoria',
          tags: tagsList,
        }
      })

      setResults(formatted)
    } catch (err) {
      console.error('Erro na busca:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    performSearch(value)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎬'
      case 'audio':
        return '🎵'
      case 'text':
        return '📄'
      default:
        return '📁'
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: DS.colors.primary.main,
          fontSize: '18px',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        🔍
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
          }}
        >
          <div
            ref={containerRef}
            style={{
              backgroundColor: DS.colors.bg.secondary,
              padding: '16px',
              borderBottom: `1px solid ${DS.colors.neutral.light}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                color: DS.colors.text.primary,
                border: `1px solid ${DS.colors.neutral.light}`,
                outline: 'none',
                fontSize: '16px',
                padding: '8px 12px',
                borderRadius: DS.borderRadius.md,
              }}
            />
            <button
              onClick={() => {
                setIsOpen(false)
                setQuery('')
                setResults([])
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: DS.colors.secondary.error,
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
            }}
          >
            {loading && (
              <div style={{ padding: '20px', textAlign: 'center', color: DS.colors.text.secondary }}>
                ⏳ Buscando...
              </div>
            )}

            {!loading && results.length === 0 && query && (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: DS.colors.text.secondary,
                }}
              >
                Nenhum resultado para "{query}"
              </div>
            )}

            {!loading && query === '' && (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: DS.colors.text.secondary,
                }}
              >
                <p style={{ margin: 0 }}>Digite para buscar</p>
              </div>
            )}

            {!loading &&
              results.length > 0 &&
              results.map((result) => (
                <Link
                  key={result.id}
                  href={`/content/${result.id}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '12px',
                    borderBottom: `1px solid ${DS.colors.neutral.light}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: DS.transitions.base,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = DS.colors.neutral.charcoal + '40'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {result.url_thumb ? (
                      <img
                        src={result.url_thumb}
                        alt={result.title}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: DS.borderRadius.md,
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: DS.borderRadius.md,
                          backgroundColor: DS.colors.neutral.medium,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0,
                        }}
                      >
                        {getTypeIcon(result.type)}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          color: DS.colors.text.dark,
                          margin: '0 0 4px 0',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {result.title}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            backgroundColor: DS.colors.neutral.medium,
                            color: DS.colors.text.secondary,
                            padding: '2px 6px',
                            borderRadius: DS.borderRadius.sm,
                          }}
                        >
                          {result.category_name}
                        </span>
                        {result.duration && (
                          <span
                            style={{
                              fontSize: '11px',
                              color: DS.colors.text.secondary,
                            }}
                          >
                            {result.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {result.tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                        paddingLeft: '60px',
                      }}
                    >
                      {result.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag.id}
                          style={{
                            fontSize: '10px',
                            backgroundColor: tag.color + '30',
                            color: tag.color,
                            padding: '2px 6px',
                            borderRadius: DS.borderRadius.sm,
                            fontWeight: '600',
                          }}
                        >
                          {tag.icon} {tag.name}
                        </span>
                      ))}
                      {result.tags.length > 2 && (
                        <span
                          style={{
                            fontSize: '10px',
                            backgroundColor: DS.colors.neutral.medium,
                            color: DS.colors.text.secondary,
                            padding: '2px 6px',
                            borderRadius: DS.borderRadius.sm,
                          }}
                        >
                          +{result.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  )
}