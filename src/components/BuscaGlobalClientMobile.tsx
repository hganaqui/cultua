// src/components/BuscaGlobalClientMobile.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Content } from '@/types'

interface SearchResult {
  id: string
  title: string
  type: 'video' | 'audio' | 'text'
  url_thumb: string | null
  duration: string | null
  category_name: string
}

export default function BuscaGlobalClientMobile() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Fechamodal ─────────────────────────────────
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
          category:categories(name)
        `
        )
        .eq('status', 'approved')
        .or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        )
        .limit(10)

      if (error) throw error

      const formatted = (data as any[]).map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        url_thumb: item.url_thumb,
        duration: item.duration,
        category_name: Array.isArray(item.category)
          ? item.category[0]?.name ?? 'Sem categoria'
          : item.category?.name ?? 'Sem categoria',
      }))

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
      {/* Botão buscar mobile */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#B8860B',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        🔍
      </button>

      {/* Modal busca mobile */}
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
              backgroundColor: '#1A1A1A',
              padding: '16px',
              borderBottom: '1px solid #333333',
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
                backgroundColor: '#2D2D2D',
                color: '#FFFFFF',
                border: '1px solid #333333',
                outline: 'none',
                fontSize: '16px',
                padding: '8px 12px',
                borderRadius: '6px',
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
                color: '#EF4444',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Resultados mobile */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
            }}
          >
            {loading && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#CCCCCC' }}>
                ⏳ Buscando...
              </div>
            )}

            {!loading && results.length === 0 && query && (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#CCCCCC',
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
                  color: '#666666',
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
                    gap: '12px',
                    padding: '12px',
                    borderBottom: '1px solid #2a2a2a',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a'
                  }}
                >
                  {result.url_thumb ? (
                    <img
                      src={result.url_thumb}
                      alt={result.title}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        backgroundColor: '#333333',
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
                        color: '#FFFFFF',
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
                          backgroundColor: '#333333',
                          color: '#CCCCCC',
                          padding: '2px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        {result.category_name}
                      </span>
                      {result.duration && (
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#666666',
                          }}
                        >
                          {result.duration}
                        </span>
                      )}
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