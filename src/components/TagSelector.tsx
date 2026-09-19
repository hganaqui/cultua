// ✅ TagSelector.tsx (ÍCONES COM COR + FUNDO PADRÃO)

'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

const TAG_ICONS: Record<string, string> = {
  'alegria': '/icons/alegria.svg',
  'ansiedade': '/icons/ansiedade.svg',
  'autoestima': '/icons/autoestima.svg',
  'crescimento': '/icons/crescimento.svg',
  'depressao': '/icons/depressao.svg',
  'esperanca': '/icons/esperanca.svg',
  'espiritualidade': '/icons/espiritualidade.svg',
  'estudos': '/icons/estudos.svg',
  'explorar': '/icons/explorar.svg',
  'familia': '/icons/familia.svg',
  'louvor': '/icons/louvor.svg',
  'oracao': '/icons/oracao.svg',
  'paz': '/icons/paz.svg',
  'perdao': '/icons/perdao.svg',
  'pregacao': '/icons/pregacao.svg',
  'relacionamentos': '/icons/relacionamentos.svg',
  'saude': '/icons/saude.svg',
  'testemunhos': '/icons/testemunhos.svg',
}

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
  const [tags, setTags] = useState<Tag[]>([])
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
      <div
        style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontSize: '13px',
          padding: '8px 0',
        }}
      >
        ⏳ Carregando temas...
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div
        style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.muted,
          fontSize: '13px',
          padding: '8px 0',
        }}
      >
        Nenhum tema disponível
      </div>
    )
  }

  const atLimit = selectedTags.length >= maxTags

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Label com Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <label
          style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.primary,
            fontSize: '13px',
            fontWeight: DS.typography.fontWeight.semibold,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          🏷️ Temas
          {selectedTags.length > 0 && (
            <span
              style={{
                backgroundColor: DS.colors.primary.main,
                color: '#FFFFFF',
                borderRadius: DS.borderRadius.full,
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: DS.typography.fontWeight.bold,
              }}
            >
              {selectedTags.length}
            </span>
          )}
        </label>

        <span
          style={{
            fontFamily: DS.typography.fontFamily.body,
            fontSize: '12px',
            color: atLimit ? DS.colors.primary.accent : DS.colors.text.muted,
            fontWeight: atLimit
              ? DS.typography.fontWeight.semibold
              : DS.typography.fontWeight.normal,
          }}
        >
          {selectedTags.length}/{maxTags}
        </span>
      </div>

      {/* Tags Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px' }}>
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag.id)
          const isDisabled = !isSelected && atLimit
          const iconPath = TAG_ICONS[tag.slug] || '/icons/explorar.svg'

          return (
            <button
              key={tag.id}
              onClick={() => !isDisabled && toggleTag(tag.id)}
              disabled={isDisabled}
              title={
                isDisabled ? `Máximo de ${maxTags} temas atingido` : undefined
              }
              style={{
                backgroundColor: isSelected
                  ? DS.colors.primary.main
                  : DS.colors.bg.secondary,
                color: isSelected ? '#FFFFFF' : DS.colors.text.primary,
                border: `2px solid ${
                  isSelected
                    ? DS.colors.primary.main
                    : DS.colors.neutral.light
                }`,
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
                boxShadow: isSelected ? DS.shadows.md : DS.shadows.sm,
              }}
              onMouseEnter={e => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.backgroundColor =
                    DS.colors.neutral.light
                }
              }}
              onMouseLeave={e => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = DS.colors.neutral.light
                  e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
                }
              }}
            >
              {/* ✅ ÍCONE COM COR */}
              <Image
                src={iconPath}
                alt={tag.name}
                width={18}
                height={18}
                style={{
                  display: 'block',
                  flexShrink: 0,
                }}
              />

              <span>{tag.name}</span>

              {isSelected && (
                <span
                  style={{
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
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedTags.length > 0 && (
        <p
          style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary,
            fontSize: '12px',
            margin: '12px 0 0',
          }}
        >
          {selectedTags.length} tema
          {selectedTags.length > 1 ? 's' : ''} selecionado
          {selectedTags.length > 1 ? 's' : ''}
          {atLimit && (
            <span
              style={{
                color: DS.colors.primary.accent,
                marginLeft: '8px',
                fontWeight: DS.typography.fontWeight.semibold,
              }}
            >
              · Limite atingido
            </span>
          )}
        </p>
      )}
    </div>
  )
}