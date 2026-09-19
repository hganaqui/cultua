// ✅ TagBadge.tsx (ÍCONES COM COR + FUNDO PADRÃO)

import Image from 'next/image'
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
  const remaining = tags.length - displayTags.length

  const padding = size === 'sm' ? '2px 8px' : '4px 10px'
  const fontSize = size === 'sm' ? '10px' : '12px'
  const iconSize = size === 'sm' ? 12 : 14

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '5px',
        marginTop: '6px',
        ...style,
      }}
    >
      {displayTags.map(tag => {
        const iconPath = TAG_ICONS[tag.slug] || '/icons/explorar.svg'

        return (
          <span
            key={tag.id}
            style={{
              backgroundColor: DS.colors.bg.secondary,
              color: DS.colors.text.primary,
              fontSize,
              fontFamily: DS.typography.fontFamily.body,
              fontWeight: DS.typography.fontWeight.semibold,
              padding,
              borderRadius: DS.borderRadius.full,
              border: `1px solid ${DS.colors.neutral.light}`,
              whiteSpace: 'nowrap' as const,
              lineHeight: '1.4',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: DS.shadows.sm,
            }}
          >
            {/* ✅ ÍCONE COM COR */}
            <Image
              src={iconPath}
              alt={tag.name}
              width={iconSize}
              height={iconSize}
              style={{ display: 'block' }}
            />
            <span>{tag.name}</span>
          </span>
        )
      })}
      {remaining > 0 && (
        <span
          style={{
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
            boxShadow: DS.shadows.sm,
          }}
        >
          +{remaining}
        </span>
      )}
    </div>
  )
}