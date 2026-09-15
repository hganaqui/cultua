import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Tag } from '@/types'

const DS = DESIGN_SYSTEM

interface TagBadgeProps {
  tags: Tag[]
  maxDisplay?: number
  size?: 'sm' | 'md'
  style?: React.CSSProperties
}

export default function TagBadge({
  tags,
  maxDisplay = 3,
  size = 'sm',
  style,
}: TagBadgeProps) {
  if (!tags || tags.length === 0) return null

  const displayTags = tags.slice(0, maxDisplay)
  const remaining   = tags.length - displayTags.length

  const padding  = size === 'sm' ? '2px 8px'  : '4px 10px'
  const fontSize = size === 'sm' ? '10px'      : '12px'

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '5px',
      marginTop: '6px',
      ...style,
    }}>
      {displayTags.map(tag => (
        <span
          key={tag.id}
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            fontSize,
            fontFamily: DS.typography.fontFamily.body,
            fontWeight: DS.typography.fontWeight.semibold,
            padding,
            borderRadius: DS.borderRadius.full,
            border: `1px solid ${tag.color}35`,
            whiteSpace: 'nowrap' as const,
            lineHeight: '1.4',
          }}
        >
          {tag.icon} {tag.name}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{
          backgroundColor: DS.colors.neutral.light,
          color: DS.colors.text.muted,
          fontSize,
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.medium,
          padding,
          borderRadius: DS.borderRadius.full,
          border: `1px solid ${DS.colors.neutral.medium}`,
          whiteSpace: 'nowrap' as const,
          lineHeight: '1.4',
        }}>
          +{remaining}
        </span>
      )}
    </div>
  )
}