'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

const CATEGORIES = [
  { id: 'louvor',      name: 'Louvor',      icon: '/icons/louvor.svg',      color: '#7C3AED' },
  { id: 'pregacao',    name: 'Pregação',    icon: '/icons/pregacao.svg',    color: '#D4A373' },
  { id: 'crescimento', name: 'Crescimento', icon: '/icons/crescimento.svg', color: DS.colors.primary.main },
  { id: 'testemunhos', name: 'Testemunhos', icon: '/icons/testemunhos.svg', color: '#D97706' },
  { id: 'familia',     name: 'Família',     icon: '/icons/familia.svg',     color: DS.colors.primary.accent },
  { id: 'estudos',     name: 'Estudos',     icon: '/icons/estudos.svg',     color: '#6B7F6B' },
]

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
          background-color: var(--cat-bg); /* ✅ MUDOU */
          border-radius: ${DS.borderRadius.xl};
          border: 1px solid var(--cat-border); /* ✅ MUDOU */
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
          border-color: rgba(15,61,46,0.2);
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
          border: 2px solid;
        }
        .tag-card:hover {
          transform: translateY(-4px);
          box-shadow: ${DS.shadows.md};
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

          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.id}`}
                className="cat-card"
                style={{
                  '--cat-bg': `${cat.color}15`,        /* ✅ MUDOU */
                  '--cat-border': `${cat.color}40`,    /* ✅ MUDOU */
                } as React.CSSProperties}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: `${cat.color}15`,
                  borderRadius: DS.borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={28}
                    height={28}
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

                <div style={{
                  width: '24px',
                  height: '3px',
                  backgroundColor: cat.color,
                  borderRadius: '2px',
                }} />
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

            <div className="tags-grid">
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="tag-card"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    borderColor: tag.color,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${tag.color}38`)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${tag.color}20`)}
                >
                  <div style={{ fontSize: '32px' }}>{tag.icon}</div>
                  <div style={{
                    fontFamily: DS.typography.fontFamily.body,
                    color: tag.color,
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