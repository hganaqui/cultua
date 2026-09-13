// src/components/BuscaGlobalClient.tsx
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

export default function BuscaGlobalClient() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Ctrl+K e ESC listeners ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K ou Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }

      // ESC para fechar
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }

      // Navegação com setas (só se modal aberto)
      if (!isOpen || results.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
      }

      // Enter para abrir resultado
      if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        const result = results[selectedIndex]
        window.location.href = `/content/${result.id}`
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // ── Fecha modal ao clicar fora ──────────────────────────────────────────
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

  // ── Busca em tempo real ─────────────────────────────────────────────────
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

      // Formatar resultados
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
      setSelectedIndex(0)
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

  // ── Ícone por tipo ──────────────────────────────────────────────────────
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

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* Botão Buscar no Header */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#2D2D2D',
          color: '#666666',
          border: '1px solid #333333',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#B8860B'
          e.currentTarget.style.color = '#CCCCCC'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#333333'
          e.currentTarget.style.color = '#666666'
        }}
      >
        🔍 Buscar...{' '}
        <kbd
          style={{
            marginLeft: '12px',
            fontSize: '11px',
            backgroundColor: '#1A1A1A',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid #444444',
          }}
        >
          Ctrl K
        </kbd>
      </button>

      {/* Modal */}
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
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '80px',
            zIndex: 9999,
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: '90%',
              maxWidth: '600px',
              backgroundColor: '#1A1A1A',
              borderRadius: '12px',
              border: '1px solid #333333',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              animation: 'slideIn 0.2s ease-out',
            }}
          >
            {/* Input */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #333333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Digite para buscar conteúdo..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  padding: '8px 0',
                }}
              />
              <span
                style={{
                  color: '#666666',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                ESC
              </span>
            </div>

            {/* Resultados */}
            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
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
                  Nenhum resultado encontrado para "{query}"
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
                  <p style={{ margin: 0 }}>Digite para começar a buscar</p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: '12px',
                    }}
                  >
                    ↑ ↓ para navegar • Enter para abrir
                  </p>
                </div>
              )}

              {!loading &&
                results.length > 0 &&
                results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={`/content/${result.id}`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px 16px',
                      borderBottom: '1px solid #2a2a2a',
                      backgroundColor:
                        index === selectedIndex ? '#2a2a2a' : 'transparent',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                      setSelectedIndex(index)
                    }}
                  >
                    {/* Thumbnail */}
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

                    {/* Info */}
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

                    {/* Type Badge */}
                    <span
                      style={{
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {getTypeIcon(result.type)}
                    </span>
                  </Link>
                ))}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #333333',
                  color: '#666666',
                  fontSize: '12px',
                  textAlign: 'right',
                }}
              >
                {results.length} resultado{results.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animação */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        div::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }
      `}</style>
    </>
  )
}