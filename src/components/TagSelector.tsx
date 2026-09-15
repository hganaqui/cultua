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
        Carregando temas...
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
      {/* Label */}
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
        }}>
          Temas
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

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
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
                backgroundColor: isSelected
                  ? tag.color
                  : DS.colors.bg.secondary,
                color: isSelected
                  ? '#FFFFFF'
                  : DS.colors.text.secondary,
                border: `1.5px solid ${isSelected ? tag.color : DS.colors.neutral.medium}`,
                borderRadius: DS.borderRadius.full,
                padding: '7px 14px',
                fontSize: '12px',
                fontFamily: DS.typography.fontFamily.body,
                fontWeight: DS.typography.fontWeight.semibold,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.45 : 1,
                transition: DS.transitions.fast,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: isSelected ? `0 2px 8px ${tag.color}40` : 'none',
              }}
              onMouseEnter={e => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = tag.color
                  e.currentTarget.style.color = tag.color
                  e.currentTarget.style.backgroundColor = `${tag.color}10`
                }
              }}
              onMouseLeave={e => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = DS.colors.neutral.medium
                  e.currentTarget.style.color = DS.colors.text.secondary
                  e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                }
              }}
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>{tag.icon}</span>
              {tag.name}
              {isSelected && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  fontSize: '9px',
                  marginLeft: '2px',
                  fontWeight: DS.typography.fontWeight.bold,
                }}>
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hint */}
      {selectedTags.length > 0 && (
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontSize: '12px',
          marginTop: '10px',
          margin: '10px 0 0',
        }}>
          {selectedTags.length} tema{selectedTags.length > 1 ? 's' : ''} selecionado{selectedTags.length > 1 ? 's' : ''}
          {atLimit && (
            <span style={{ color: DS.colors.primary.accent, marginLeft: '6px', fontWeight: DS.typography.fontWeight.semibold }}>
              · Limite atingido
            </span>
          )}
        </p>
      )}
    </div>
  )
}