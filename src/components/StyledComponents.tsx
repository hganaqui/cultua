// src/components/StyledComponents.tsx
// 🎨 COMPONENTES ESTILIZADOS REUTILIZÁVEIS (CORES CORRETAS)

import { ReactNode, CSSProperties } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

// ═══════════════════════════════════════════════════════════════
// CONTAINERS
// ═══════════════════════════════════════════════════════════════

export function PageContainer({ children, darkMode = false }: { children: ReactNode; darkMode?: boolean }) {
  return (
    <main style={{
      maxWidth: '1200px',
      width: '100%',
      boxSizing: 'border-box',
      margin: '0 auto',
      padding: DS.spacing.lg,
      backgroundColor: darkMode ? DS.colors.bg.dark : DS.colors.bg.primary,
    }}>
      {children}
    </main>
  )
}

export function Card({ children, style, darkMode = false }: { children: ReactNode; style?: CSSProperties; darkMode?: boolean }) {
  return (
    <div style={{
      backgroundColor: darkMode ? DS.colors.bg.darkCard : DS.colors.bg.secondary,
      borderRadius: DS.borderRadius.lg,
      padding: DS.spacing['2xl'],
      border: `1px solid ${darkMode ? '#333333' : DS.colors.neutral.light}`,
      boxShadow: DS.shadows.sm,
      transition: DS.transitions.base,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// BUTTONS
// ═══════════════════════════════════════════════════════════════

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#A8A8A8' : DS.colors.primary.main,
        color: 'white',
        border: 'none',
        borderRadius: DS.borderRadius.md,
        padding: `${DS.spacing.md} ${DS.spacing.lg}`,
        fontSize: DS.typography.fontSize.lg,
        fontWeight: DS.typography.fontWeight.bold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.backgroundColor = DS.colors.primary.light
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.backgroundColor = DS.colors.primary.main
        }
      }}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: DS.colors.bg.primary,
        color: DS.colors.text.primary,
        border: `2px solid ${DS.colors.neutral.light}`,
        borderRadius: DS.borderRadius.md,
        padding: `${DS.spacing.md} ${DS.spacing.lg}`,
        fontSize: DS.typography.fontSize.lg,
        fontWeight: DS.typography.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.borderColor = DS.colors.primary.main
          btn.style.color = DS.colors.primary.main
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.borderColor = DS.colors.neutral.light
          btn.style.color = DS.colors.text.primary
        }
      }}
    >
      {children}
    </button>
  )
}

export function DangerButton({
  children,
  onClick,
  disabled = false,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: 'rgba(239,68,68,0.1)',
        color: DS.colors.secondary.error,
        border: `2px solid ${DS.colors.secondary.error}40`,
        borderRadius: DS.borderRadius.md,
        padding: `${DS.spacing.md} ${DS.spacing.lg}`,
        fontSize: DS.typography.fontSize.lg,
        fontWeight: DS.typography.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.backgroundColor = 'rgba(239,68,68,0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.backgroundColor = 'rgba(239,68,68,0.1)'
        }
      }}
    >
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════
// INPUTS
// ═══════════════════════════════════════════════════════════════

export function TextInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  style,
}: {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
  style?: CSSProperties
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        border: `2px solid ${DS.colors.neutral.light}`,
        borderRadius: DS.borderRadius.md,
        padding: DS.spacing.md,
        color: DS.colors.text.primary,
        fontSize: DS.typography.fontSize.base,
        outline: 'none',
        boxSizing: 'border-box',
        transition: DS.transitions.base,
        ...style,
      }}
      onFocus={(e) => {
        const input = e.currentTarget as HTMLInputElement
        input.style.borderColor = DS.colors.primary.main
      }}
      onBlur={(e) => {
        const input = e.currentTarget as HTMLInputElement
        input.style.borderColor = DS.colors.neutral.light
      }}
    />
  )
}

export function TextArea({
  placeholder,
  value,
  onChange,
  rows = 4,
  style,
}: {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  style?: CSSProperties
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        border: `2px solid ${DS.colors.neutral.light}`,
        borderRadius: DS.borderRadius.md,
        padding: DS.spacing.md,
        color: DS.colors.text.primary,
        fontSize: DS.typography.fontSize.base,
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: DS.typography.fontFamily.main,
        resize: 'vertical',
        transition: DS.transitions.base,
        ...style,
      }}
      onFocus={(e) => {
        const textarea = e.currentTarget as HTMLTextAreaElement
        textarea.style.borderColor = DS.colors.primary.main
      }}
      onBlur={(e) => {
        const textarea = e.currentTarget as HTMLTextAreaElement
        textarea.style.borderColor = DS.colors.neutral.light
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════
// HEADERS
// ═══════════════════════════════════════════════════════════════

export function PageHeader({ title, subtitle, darkMode = false }: { title: string; subtitle?: string; darkMode?: boolean }) {
  return (
    <div style={{ marginBottom: DS.spacing['3xl'] }}>
      <h1
        style={{
          fontSize: DS.typography.fontSize['4xl'],
          fontWeight: DS.typography.fontWeight.extrabold,
          color: darkMode ? '#FFFFFF' : DS.colors.text.dark,
          marginBottom: DS.spacing.sm,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: DS.typography.fontSize.lg,
            color: darkMode ? '#CCCCCC' : DS.colors.text.secondary,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════════════════════════

export function Badge({
  children,
  variant = 'default',
  color,
}: {
  children: ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning' | 'primary'
  color?: string
}) {
  const variantColors = {
    default: { bg: DS.colors.neutral.light + '20', text: DS.colors.text.secondary },
    success: { bg: `${DS.colors.secondary.success}20`, text: DS.colors.secondary.success },
    error: { bg: `${DS.colors.secondary.error}20`, text: DS.colors.secondary.error },
    warning: { bg: `${DS.colors.secondary.warning}20`, text: DS.colors.secondary.warning },
    primary: { bg: `${DS.colors.primary.main}20`, text: DS.colors.primary.main },
  }

  const colors_obj = color
    ? { bg: `${color}20`, text: color }
    : variantColors[variant]

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: colors_obj.bg,
        color: colors_obj.text,
        padding: `${DS.spacing.sm} ${DS.spacing.md}`,
        borderRadius: DS.borderRadius.full,
        fontSize: DS.typography.fontSize.sm,
        fontWeight: DS.typography.fontWeight.semibold,
      }}
    >
      {children}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// GRID
// ═══════════════════════════════════════════════════════════════

export function Grid({
  children,
  cols = 3,
  gap = 'lg',
}: {
  children: ReactNode
  cols?: number
  gap?: keyof typeof DS.spacing
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
        gap: DS.spacing[gap],
      }}
    >
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════════════

export function Alert({
  children,
  type = 'info',
}: {
  children: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
}) {
  const typeStyles = {
    success: {
      bg: `${DS.colors.secondary.success}15`,
      border: `2px solid ${DS.colors.secondary.success}40`,
      text: DS.colors.secondary.success,
    },
    error: {
      bg: `${DS.colors.secondary.error}15`,
      border: `2px solid ${DS.colors.secondary.error}40`,
      text: DS.colors.secondary.error,
    },
    warning: {
      bg: `${DS.colors.secondary.warning}15`,
      border: `2px solid ${DS.colors.secondary.warning}40`,
      text: DS.colors.secondary.warning,
    },
    info: {
      bg: `${DS.colors.secondary.info}15`,
      border: `2px solid ${DS.colors.secondary.info}40`,
      text: DS.colors.secondary.info,
    },
  }

  const style = typeStyles[type]

  return (
    <div
      style={{
        backgroundColor: style.bg,
        border: style.border,
        borderRadius: DS.borderRadius.md,
        padding: DS.spacing.lg,
        color: style.text,
        fontSize: DS.typography.fontSize.base,
        lineHeight: DS.typography.lineHeight.normal,
      }}
    >
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════════════

export function Divider({ style }: { style?: CSSProperties }) {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `1px solid ${DS.colors.neutral.light}`,
        margin: `${DS.spacing.xl} 0`,
        ...style,
      }}
    />
  )
}