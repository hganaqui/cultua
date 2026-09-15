// src/components/SeloCuradoria.tsx
// Brand book item 8 — Selo "Selecionado pelo CULTUA"

import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export type SeloVariant = 'default' | 'compact' | 'pill'

interface SeloCuradoriaProps {
  variant?: SeloVariant
  className?: string
  style?: React.CSSProperties
}

export default function SeloCuradoria({
  variant = 'default',
  className,
  style,
}: SeloCuradoriaProps) {

  if (variant === 'compact') {
    return (
      <div
        className={className}
        title="Selecionado pelo CULTUA"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: DS.colors.primary.main,
          color: '#FFFFFF',
          borderRadius: DS.borderRadius.sm,
          padding: '3px 7px',
          fontSize: '10px',
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.semibold,
          letterSpacing: '0.3px',
          whiteSpace: 'nowrap' as const,
          ...style,
        }}
      >
        <CheckIcon size={9} color={DS.colors.primary.accent} />
        CULTUA
      </div>
    )
  }

  if (variant === 'pill') {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(15, 61, 46, 0.07)',
          border: '1px solid rgba(15, 61, 46, 0.18)',
          color: DS.colors.primary.main,
          borderRadius: DS.borderRadius.full,
          padding: '5px 14px',
          fontSize: '12px',
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.medium,
          whiteSpace: 'nowrap' as const,
          ...style,
        }}
      >
        <CheckIcon size={11} color={DS.colors.primary.accent} />
        Selecionado pelo CULTUA
      </div>
    )
  }

  // default — cards de conteúdo
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: DS.colors.primary.main,
        color: '#FFFFFF',
        borderRadius: DS.borderRadius.md,
        padding: '4px 10px',
        fontSize: '11px',
        fontFamily: DS.typography.fontFamily.body,
        fontWeight: DS.typography.fontWeight.semibold,
        letterSpacing: '0.2px',
        whiteSpace: 'nowrap' as const,
        boxShadow: '0 2px 8px rgba(15, 61, 46, 0.22)',
        ...style,
      }}
    >
      <CheckIcon size={10} color={DS.colors.primary.accent} />
      Selecionado pelo CULTUA
    </div>
  )
}

function CheckIcon({ size = 12, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2 6L5 9L10 3"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}