'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tagIds: string[]) => void
  maxTags?: number
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagSelectorProps) {
  const [tags, setTags]       = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTags() {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('name')
        if (error) throw error
        setTags(data ?? [])
      } catch (err) {
        console.error('[TagSelector]', err)
      } finally {
        setLoading(false)
      }
    }
    loadTags()
  }, [])

  function toggleTag(tagId: string) {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId))
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tagId])
    }
  }

  if (loading) {
    return (
      <div style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: '13px',
        padding: '8px 0',
      }}>
        ⏳ Carregando temas...
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.muted,
        fontSize: '13px',
        padding: '8px 0',
      }}>
        Nenhum tema disponível
      </div>
    )
  }

  const atLimit = selectedTags.length >= maxTags

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Label com Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <label style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.primary,
          fontSize: '13px',
          fontWeight: DS.typography.fontWeight.semibold,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          🏷️ Temas
          {selectedTags.length > 0 && (
            <span style={{
              backgroundColor: DS.colors.primary.main,
              color: '#FFFFFF',
              borderRadius: DS.borderRadius.full,
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: DS.typography.fontWeight.bold,
            }}>
              {selectedTags.length}
            </span>
          )}
        </label>

        <span style={{
          fontFamily: DS.typography.fontFamily.body,
          fontSize: '12px',
          color: atLimit ? DS.colors.primary.accent : DS.colors.text.muted,
          fontWeight: atLimit ? DS.typography.fontWeight.semibold : DS.typography.fontWeight.normal,
        }}>
          {selectedTags.length}/{maxTags}
        </span>
      </div>

      {/* Tags Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px' }}>
        {tags.map(tag => {
          const isSelected  = selectedTags.includes(tag.id)
          const isDisabled  = !isSelected && atLimit

          return (
            <button
              key={tag.id}
              onClick={() => !isDisabled && toggleTag(tag.id)}
              disabled={isDisabled}
              title={isDisabled ? `Máximo de ${maxTags} temas atingido` : undefined}
              style={{
                backgroundColor: isSelected ? tag.color : 'transparent',
                color: isSelected ? DS.colors.text.primary : tag.color, // ✅ SEMPRE Grafite do projeto
                border: `2px solid ${tag.color}${isSelected ? 'FF' : '50'}`,
                borderRadius: DS.borderRadius.full,
                padding: '10px 16px',
                fontSize: '13px',
                fontFamily: DS.typography.fontFamily.body,
                fontWeight: DS.typography.fontWeight.semibold,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.45 : 1,
                transition: DS.transitions.fast,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isSelected ? `0 4px 12px ${tag.color}40` : 'none',
              }}
              onMouseEnter={e => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.backgroundColor = `${tag.color}12`
                  e.currentTarget.style.borderColor = tag.color
                }
              }}
              onMouseLeave={e => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = `${tag.color}50`
                }
              }}
            >
              {/* Ícone Grande */}
              <span style={{
                fontSize: '18px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {tag.icon}
              </span>

              {/* Texto */}
              <span>{tag.name}</span>

              {/* Checkmark */}
              {isSelected && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  fontSize: '10px',
                  marginLeft: '4px',
                  fontWeight: DS.typography.fontWeight.bold,
                  flexShrink: 0,
                }}>
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Status Hint */}
      {selectedTags.length > 0 && (
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontSize: '12px',
          margin: '12px 0 0',
        }}>
          {selectedTags.length} tema{selectedTags.length > 1 ? 's' : ''} selecionado{selectedTags.length > 1 ? 's' : ''}
          {atLimit && (
            <span style={{
              color: DS.colors.primary.accent,
              marginLeft: '8px',
              fontWeight: DS.typography.fontWeight.semibold,
            }}>
              · Limite atingido
            </span>
          )}
        </p>
      )}
    </div>
  )
}