import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface TagBadgeProps {
  tags: Tag[]
  maxDisplay?: number
}

export default function TagBadge({ tags, maxDisplay = 3 }: TagBadgeProps) {
  const displayTags = tags.slice(0, maxDisplay)
  const remaining = tags.length - displayTags.length

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
      {displayTags.map(tag => (
        <span
          key={tag.id}
          style={{
            backgroundColor: tag.color + '20',
            color: tag.color,
            fontSize: '11px',
            fontWeight: DS.typography.fontWeight.semibold,
            padding: '2px 8px',
            borderRadius: DS.borderRadius.full,
            border: `1px solid ${tag.color}40`,
          }}
        >
          {tag.icon} {tag.name}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{
          backgroundColor: DS.colors.neutral.medium,
          color: DS.colors.text.secondary,
          fontSize: '11px',
          fontWeight: DS.typography.fontWeight.semibold,
          padding: '2px 8px',
          borderRadius: DS.borderRadius.full,
        }}>
          +{remaining}
        </span>
      )}
    </div>
  )
}