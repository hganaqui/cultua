// ✅ app/components/CategorySection.tsx (ÍCONES COM COR + FUNDO PADRÃO)

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

const CATEGORIES = [
  { id: 'louvor',      name: 'Louvor',      icon: '/icons/louvor.svg' },
  { id: 'pregacao',    name: 'Pregação',    icon: '/icons/pregacao.svg' },
  { id: 'crescimento', name: 'Crescimento', icon: '/icons/crescimento.svg' },
  { id: 'testemunhos', name: 'Testemunhos', icon: '/icons/testemunhos.svg' },
  { id: 'familia',     name: 'Família',     icon: '/icons/familia.svg' },
  { id: 'estudos',     name: 'Estudos',     icon: '/icons/estudos.svg' },
]

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  return url.startsWith('/') || url.startsWith('http')
}

export default function CategorySection() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)

  useEffect(() => {
    async function loadTags() {
      try {
        const { data } = await supabase.from('tags').select('*').order('name')
        setTags(data ?? [])
      } catch (err) {
        console.error('[CategorySection] tags:', err)
      } finally {
        setLoadingTags(false)
      }
    }
    loadTags()
  }, [])

  return (
    <section style={{ padding: '64px 16px', backgroundColor: DS.colors.bg.primary }}>
      <style>{`
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }

        .cat-card {
          text-decoration: none;
          background-color: ${DS.colors.bg.secondary};
          border-radius: ${DS.borderRadius.xl};
          border: 1px solid ${DS.colors.neutral.light};
          padding: 28px 12px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: ${DS.shadows.sm};
        }
        .cat-card:hover {
          transform: translateY(-4px);
          box-shadow: ${DS.shadows.lg};
          border-color: ${DS.colors.primary.main}80;
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        @media (max-width: 640px) { .tags-grid { grid-template-columns: repeat(2, 1fr); } }

        .tag-card {
          text-decoration: none;
          border-radius: ${DS.borderRadius.lg};
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid ${DS.colors.neutral.light};
          background-color: ${DS.colors.bg.secondary};
        }
        .tag-card:hover {
          transform: translateY(-4px);
          box-shadow: ${DS.shadows.md};
          border-color: ${DS.colors.primary.main};
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: '28px',
              fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.text.primary,
              marginBottom: '8px',
              letterSpacing: '-0.3px',
            }}>
              O que você quer explorar hoje?
            </h2>
            <p style={{
              fontFamily: DS.typography.fontFamily.body,
              color: DS.colors.text.secondary,
              fontSize: '15px',
            }}>
              Cada categoria curada para edificar e aproximar você de Deus
            </p>
          </div>

          {/* ✅ CATEGORIAS - ÍCONES COM COR */}
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.id}`}
                className="cat-card"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={40}
                    height={40}
                    style={{
                      display: 'block',
                    }}
                  />
                </div>

                <div style={{
                  fontFamily: DS.typography.fontFamily.heading,
                  fontSize: '14px',
                  fontWeight: DS.typography.fontWeight.semibold,
                  color: DS.colors.text.primary,
                }}>
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {!loadingTags && tags.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '28px',
                fontWeight: DS.typography.fontWeight.bold,
                color: DS.colors.text.primary,
                marginBottom: '8px',
                letterSpacing: '-0.3px',
              }}>
                Buscar por Tema
              </h2>
              <p style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                fontSize: '15px',
              }}>
                Encontre conteúdo específico por tema de interesse
              </p>
            </div>

            {/* ✅ TAGS - ÍCONES COM COR + FUNDO PADRÃO */}
            <div className="tags-grid">
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="tag-card"
                >
                  {/* ✅ ÍCONE COM COR */}
                  {isValidImageUrl(tag.icon) ? (
                    <Image
                      src={tag.icon}
                      alt={tag.name}
                      width={32}
                      height={32}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '32px',
                      lineHeight: 1,
                      display: 'block',
                    }}>
                      {tag.icon}
                    </span>
                  )}

                  {/* ✅ TEXTO SEMPRE GRAFITE */}
                  <div style={{
                    fontFamily: DS.typography.fontFamily.body,
                    color: DS.colors.text.primary,
                    fontSize: '14px',
                    fontWeight: DS.typography.fontWeight.semibold,
                  }}>
                    {tag.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {loadingTags && (
          <div style={{
            textAlign: 'center',
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.muted,
            fontSize: '14px',
            padding: '24px 0',
          }}>
            Carregando temas...
          </div>
        )}
      </div>
    </section>
  )
}