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
  maxTags = 5 
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
        setTags(data || [])
      } catch (err) {
        console.error('Erro ao carregar tags:', err)
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

  if (loading) return <div style={{ color: DS.colors.text.secondary }}>Carregando tags...</div>

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ 
        display: 'block', 
        color: DS.colors.text.secondary, 
        fontSize: '13px', 
        fontWeight: '600', 
        marginBottom: '12px' 
      }}>
        Temas ({selectedTags.length}/{maxTags})
      </label>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            disabled={!selectedTags.includes(tag.id) && selectedTags.length >= maxTags}
            style={{
              backgroundColor: selectedTags.includes(tag.id) ? tag.color : DS.colors.neutral.charcoal,
              color: selectedTags.includes(tag.id) ? '#FFFFFF' : DS.colors.text.secondary,
              border: `1px solid ${selectedTags.includes(tag.id) ? tag.color : DS.colors.neutral.light}`,
              borderRadius: DS.borderRadius.full,
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: DS.typography.fontWeight.semibold,
              cursor: selectedTags.includes(tag.id) || selectedTags.length < maxTags ? 'pointer' : 'not-allowed',
              opacity: !selectedTags.includes(tag.id) && selectedTags.length >= maxTags ? 0.5 : 1,
              transition: DS.transitions.base,
            }}
            onMouseEnter={(e) => {
              if (selectedTags.includes(tag.id) || selectedTags.length < maxTags) {
                e.currentTarget.style.opacity = '0.8'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = selectedTags.includes(tag.id) ? '1' : (!selectedTags.includes(tag.id) && selectedTags.length >= maxTags ? '0.5' : '1')
            }}
          >
            {tag.icon} {tag.name}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <p style={{ color: DS.colors.text.secondary, fontSize: '12px', marginTop: '8px' }}>
          {selectedTags.length} tema{selectedTags.length > 1 ? 's' : ''} selecionado{selectedTags.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}