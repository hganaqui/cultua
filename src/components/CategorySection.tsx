'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

const categories = [
  {
    id: 'louvor',
    name: 'Louvor',
    icon: '🎵',
    description: 'Músicas de louvor e adoração',
    color: DS.colors.primary.main,
    bg: DS.colors.primary.main + '12',
    count: 'Explorar',
  },
  {
    id: 'pregacao',
    name: 'Pregação',
    icon: '📖',
    description: 'Mensagens e ensinamentos bíblicos',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.12)',
    count: 'Explorar',
  },
  {
    id: 'crescimento',
    name: 'Crescimento',
    icon: '🌱',
    description: 'Devocionais e estudos bíblicos',
    color: DS.colors.secondary.success,
    bg: DS.colors.secondary.success + '12',
    count: 'Explorar',
  },
  {
    id: 'testemunhos',
    name: 'Testemunhos',
    icon: '🙏',
    description: 'Histórias reais de fé e transformação',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.12)',
    count: 'Explorar',
  },
]

export default function CategorySection() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)

  useEffect(() => {
    async function loadTags() {
      try {
        const { data } = await supabase
          .from('tags')
          .select('*')
          .order('name')

        setTags(data ?? [])
      } catch (err) {
        console.error('Erro ao carregar tags:', err)
      } finally {
        setLoadingTags(false)
      }
    }
    loadTags()
  }, [])

  return (
    <section style={{ padding: '64px 16px', backgroundColor: DS.colors.bg.primary }}>
      <style>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .category-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .category-grid { grid-template-columns: 1fr !important; }
        }
        .category-card {
          text-decoration: none;
          background-color: ${DS.colors.bg.secondary};
          border-radius: ${DS.borderRadius.lg}px;
          padding: 0;
          border: 1px solid ${DS.colors.neutral.light};
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1 / 1;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: ${DS.shadows.md};
          border-color: ${DS.colors.primary.main};
        }
        .category-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          width: 100%;
          height: 100%;
        }
        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        @media (max-width: 768px) {
          .tags-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .tags-grid { grid-template-columns: 1fr; }
        }
        .tag-card {
          text-decoration: none;
          border-radius: ${DS.borderRadius.lg}px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
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

        {/* ── CATEGORIAS ── */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px', 
              fontWeight: DS.typography.fontWeight.extrabold,
              color: DS.colors.text.dark,
              marginBottom: '12px',
            }}>
              O que você quer explorar hoje?
            </h2>
            <p style={{ color: DS.colors.text.secondary, fontSize: '16px' }}>
              Cada categoria curada para edificar e aproximar você de Deus
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.id}`}
                className="category-card"
              >
                <div className="category-card-content">
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                    {cat.icon}
                  </div>

                  <h3 style={{
                    fontSize: '18px', 
                    fontWeight: DS.typography.fontWeight.bold,
                    color: DS.colors.text.dark,
                    marginBottom: '8px',
                    margin: 0,
                  }}>
                    {cat.name}
                  </h3>

                  <div style={{
                    width: '32px',
                    height: '3px',
                    backgroundColor: cat.color,
                    borderRadius: '2px',
                    marginTop: '12px',
                  }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ✅ SEÇÃO DE TEMAS/TAGS */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px', 
              fontWeight: DS.typography.fontWeight.extrabold,
              color: DS.colors.text.dark,
              marginBottom: '12px',
            }}>
              Buscar por Tema
            </h2>
            <p style={{ color: DS.colors.text.secondary, fontSize: '16px' }}>
              Encontre conteúdo específico por tema de interesse
            </p>
          </div>

          {loadingTags ? (
            <div style={{ textAlign: 'center', color: DS.colors.text.secondary }}>
              Carregando temas...
            </div>
          ) : tags.length === 0 ? (
            <div style={{ textAlign: 'center', color: DS.colors.text.secondary }}>
              Nenhum tema disponível
            </div>
          ) : (
            <div className="tags-grid">
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="tag-card"
                  style={{
                    backgroundColor: tag.color + '20',
                    borderColor: tag.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tag.color + '40'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tag.color + '20'
                  }}
                >
                  <div style={{ fontSize: '32px' }}>{tag.icon}</div>
                  <div style={{
                    color: tag.color,
                    fontSize: '14px',
                    fontWeight: DS.typography.fontWeight.bold,
                  }}>
                    {tag.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}