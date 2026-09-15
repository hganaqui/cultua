import { ReactNode, CSSProperties } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

// ── Aliases de status (substituem DS.colors.secondary.*) ──────────
const STATUS = {
  success: '#6B7F6B',
  warning: DS.colors.primary.accent,  // dourado
  error:   '#C84C3C',
  info:    DS.colors.primary.light,   // verde médio
} as const

// ═══════════════════════════════════════════════════════════════
// CONTAINERS
// ═══════════════════════════════════════════════════════════════

export function PageContainer({
  children,
  darkMode = false,
  style,
}: {
  children: ReactNode
  darkMode?: boolean
  style?: CSSProperties
}) {
  return (
    <main style={{
      maxWidth: '1200px',
      width: '100%',
      boxSizing: 'border-box' as const,
      margin: '0 auto',
      padding: DS.spacing.lg,
      backgroundColor: darkMode ? DS.colors.primary.dark : DS.colors.bg.primary,
      ...style,
    }}>
      {children}
    </main>
  )
}

export function Card({
  children,
  style,
  darkMode = false,
  hoverable = false,
}: {
  children: ReactNode
  style?: CSSProperties
  darkMode?: boolean
  hoverable?: boolean
}) {
  return (
    <div style={{
      backgroundColor: darkMode ? DS.colors.primary.dark : DS.colors.bg.secondary,
      borderRadius: DS.borderRadius.lg,
      padding: DS.spacing['2xl'],
      border: `1px solid ${darkMode ? `${DS.colors.primary.accent}30` : DS.colors.neutral.light}`,
      boxShadow: DS.shadows.sm,
      transition: hoverable ? DS.transitions.base : undefined,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function Section({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <section style={{
      padding: `${DS.spacing['6xl']} ${DS.spacing.lg}`,
      ...style,
    }}>
      {children}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// BUTTONS
// ═══════════════════════════════════════════════════════════════

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: CSSProperties
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { padding: `${DS.spacing.sm} ${DS.spacing.md}`,  fontSize: DS.typography.fontSize.sm  },
  md: { padding: `${DS.spacing.md} ${DS.spacing.lg}`,  fontSize: DS.typography.fontSize.lg  },
  lg: { padding: `${DS.spacing.lg} ${DS.spacing['3xl']}`, fontSize: DS.typography.fontSize.xl },
}

export function PrimaryButton({
  children, onClick, disabled = false, type = 'button', style, fullWidth, size = 'md',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? DS.colors.neutral.medium : DS.colors.primary.main,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: DS.borderRadius.lg,
        fontFamily: DS.typography.fontFamily.body,
        fontWeight: DS.typography.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: disabled ? 'none' : '0 4px 16px rgba(15, 61, 46, 0.2)',
        ...sizeMap[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.backgroundColor = DS.colors.primary.light
      }}
      onMouseLeave={e => {
        if (!disabled) e.currentTarget.style.backgroundColor = DS.colors.primary.main
      }}
    >
      {children}
    </button>
  )
}

export function AccentButton({
  children, onClick, disabled = false, type = 'button', style, fullWidth, size = 'md',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? DS.colors.neutral.medium : DS.colors.primary.accent,
        color: DS.colors.primary.main,
        border: 'none',
        borderRadius: DS.borderRadius.lg,
        fontFamily: DS.typography.fontFamily.body,
        fontWeight: DS.typography.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...sizeMap[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.backgroundColor = DS.colors.primary.accentLight
      }}
      onMouseLeave={e => {
        if (!disabled) e.currentTarget.style.backgroundColor = DS.colors.primary.accent
      }}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children, onClick, disabled = false, type = 'button', style, fullWidth, size = 'md',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: DS.colors.bg.secondary,
        color: DS.colors.text.primary,
        border: `1.5px solid ${DS.colors.neutral.medium}`,
        borderRadius: DS.borderRadius.lg,
        fontFamily: DS.typography.fontFamily.body,
        fontWeight: DS.typography.fontWeight.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...sizeMap[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.borderColor = DS.colors.primary.main
          e.currentTarget.style.color = DS.colors.primary.main
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.borderColor = DS.colors.neutral.medium
          e.currentTarget.style.color = DS.colors.text.primary
        }
      }}
    >
      {children}
    </button>
  )
}

export function DangerButton({
  children, onClick, disabled = false, type = 'button', style, fullWidth, size = 'md',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: `${STATUS.error}12`,
        color: STATUS.error,
        border: `1.5px solid ${STATUS.error}40`,
        borderRadius: DS.borderRadius.lg,
        fontFamily: DS.typography.fontFamily.body,
        fontWeight: DS.typography.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.base,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...sizeMap[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.backgroundColor = `${STATUS.error}20`
      }}
      onMouseLeave={e => {
        if (!disabled) e.currentTarget.style.backgroundColor = `${STATUS.error}12`
      }}
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children, onClick, disabled = false, type = 'button', style, fullWidth, size = 'md',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: 'transparent',
        color: DS.colors.text.secondary,
        border: 'none',
        borderRadius: DS.borderRadius.lg,
        fontFamily: DS.typography.fontFamily.body,
        fontWeight: DS.typography.fontWeight.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: DS.transitions.fast,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...sizeMap[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'
          e.currentTarget.style.color = DS.colors.text.primary
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = DS.colors.text.secondary
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

interface InputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
  disabled?: boolean
  error?: string
  style?: CSSProperties
}

export function TextInput({ placeholder, value, onChange, type = 'text', disabled, error, style }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        backgroundColor: disabled ? DS.colors.neutral.light : DS.colors.bg.secondary,
        border: `1.5px solid ${error ? STATUS.error : DS.colors.neutral.medium}`,
        borderRadius: DS.borderRadius.md,
        padding: '11px 14px',
        color: DS.colors.text.primary,
        fontFamily: DS.typography.fontFamily.body,
        fontSize: DS.typography.fontSize.base,
        outline: 'none',
        boxSizing: 'border-box' as const,
        transition: DS.transitions.fast,
        cursor: disabled ? 'not-allowed' : undefined,
        opacity: disabled ? 0.65 : 1,
        ...style,
      }}
      onFocus={e => {
        if (!disabled) e.currentTarget.style.borderColor = error ? STATUS.error : DS.colors.primary.main
        if (!disabled) e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? `${STATUS.error}15` : 'rgba(15,61,46,0.10)'}`
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? STATUS.error : DS.colors.neutral.medium
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}

export function TextArea({
  placeholder, value, onChange, rows = 4, disabled, error, style,
}: InputProps & { rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        width: '100%',
        backgroundColor: disabled ? DS.colors.neutral.light : DS.colors.bg.secondary,
        border: `1.5px solid ${error ? STATUS.error : DS.colors.neutral.medium}`,
        borderRadius: DS.borderRadius.md,
        padding: '11px 14px',
        color: DS.colors.text.primary,
        fontFamily: DS.typography.fontFamily.body,
        fontSize: DS.typography.fontSize.base,
        outline: 'none',
        boxSizing: 'border-box' as const,
        resize: 'vertical' as const,
        transition: DS.transitions.fast,
        cursor: disabled ? 'not-allowed' : undefined,
        opacity: disabled ? 0.65 : 1,
        ...style,
      }}
      onFocus={e => {
        if (!disabled) e.currentTarget.style.borderColor = DS.colors.primary.main
        if (!disabled) e.currentTarget.style.boxShadow = 'rgba(15,61,46,0.10) 0 0 0 3px'
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? STATUS.error : DS.colors.neutral.medium
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════
// HEADERS
// ═══════════════════════════════════════════════════════════════

export function PageHeader({
  title,
  subtitle,
  darkMode = false,
  style,
}: {
  title: string
  subtitle?: string
  darkMode?: boolean
  style?: CSSProperties
}) {
  return (
    <div style={{ marginBottom: DS.spacing['3xl'], ...style }}>
      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        fontSize: DS.typography.fontSize['5xl'],
        fontWeight: DS.typography.fontWeight.bold,
        color: darkMode ? '#FFFFFF' : DS.colors.text.primary,
        marginBottom: DS.spacing.sm,
        letterSpacing: '-0.5px',
        lineHeight: 1.2,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          fontSize: DS.typography.fontSize['2xl'],
          color: darkMode ? 'rgba(255,255,255,0.7)' : DS.colors.text.secondary,
          margin: 0,
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function SectionTitle({
  children,
  subtitle,
  align = 'left',
}: {
  children: ReactNode
  subtitle?: string
  align?: 'left' | 'center'
}) {
  return (
    <div style={{ marginBottom: DS.spacing['3xl'], textAlign: align }}>
      <h2 style={{
        fontFamily: DS.typography.fontFamily.heading,
        fontSize: DS.typography.fontSize['4xl'],
        fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.text.primary,
        marginBottom: subtitle ? DS.spacing.sm : 0,
        letterSpacing: '-0.3px',
      }}>
        {children}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          fontSize: DS.typography.fontSize.xl,
          color: DS.colors.text.secondary,
          margin: 0,
        }}>
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
  variant?: 'default' | 'success' | 'error' | 'warning' | 'primary' | 'accent'
  color?: string
}) {
  const variantMap: Record<string, { bg: string; text: string; border: string }> = {
    default: {
      bg:     `${DS.colors.neutral.medium}25`,
      text:   DS.colors.text.secondary,
      border: DS.colors.neutral.medium,
    },
    success: {
      bg:     `${STATUS.success}18`,
      text:   STATUS.success,
      border: `${STATUS.success}40`,
    },
    error: {
      bg:     `${STATUS.error}15`,
      text:   STATUS.error,
      border: `${STATUS.error}40`,
    },
    warning: {
      bg:     `${STATUS.warning}18`,
      text:   '#8B5E3C',
      border: `${STATUS.warning}50`,
    },
    primary: {
      bg:     `${DS.colors.primary.main}12`,
      text:   DS.colors.primary.main,
      border: `${DS.colors.primary.main}30`,
    },
    accent: {
      bg:     `${DS.colors.primary.accent}18`,
      text:   '#8B5E3C',
      border: `${DS.colors.primary.accent}45`,
    },
  }

  const c = color
    ? { bg: `${color}18`, text: color, border: `${color}40` }
    : variantMap[variant]

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      padding: `${DS.spacing.xs} ${DS.spacing.md}`,
      borderRadius: DS.borderRadius.full,
      fontSize: DS.typography.fontSize.xs,
      fontFamily: DS.typography.fontFamily.body,
      fontWeight: DS.typography.fontWeight.semibold,
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap' as const,
    }}>
      {children}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// STATUS BADGES — para painel admin
// ═══════════════════════════════════════════════════════════════

export function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const map = {
    pending:  { label: '⏳ Pendente',  variant: 'warning' },
    approved: { label: '✅ Aprovado',  variant: 'success' },
    rejected: { label: '❌ Rejeitado', variant: 'error'   },
  } as const
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

// ═══════════════════════════════════════════════════════════════
// GRID
// ═══════════════════════════════════════════════════════════════

export function Grid({
  children,
  minColWidth = '250px',
  gap = 'lg',
  style,
}: {
  children: ReactNode
  minColWidth?: string
  gap?: keyof typeof DS.spacing
  style?: CSSProperties
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${minColWidth}, 1fr))`,
      gap: DS.spacing[gap],
      ...style,
    }}>
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
  style,
}: {
  children: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  style?: CSSProperties
}) {
  const typeMap = {
    success: { color: STATUS.success },
    error:   { color: STATUS.error   },
    warning: { color: STATUS.warning },
    info:    { color: DS.colors.primary.main },
  }
  const { color } = typeMap[type]

  return (
    <div style={{
      backgroundColor: `${color}10`,
      border: `1.5px solid ${color}35`,
      borderRadius: DS.borderRadius.lg,
      padding: DS.spacing.lg,
      color,
      fontFamily: DS.typography.fontFamily.body,
      fontSize: DS.typography.fontSize.base,
      lineHeight: DS.typography.lineHeight.normal,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LOADING
// ═══════════════════════════════════════════════════════════════

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `2px solid ${DS.colors.neutral.medium}`,
      borderTopColor: DS.colors.primary.main,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column' as const,
      gap: '16px',
    }}>
      <LoadingSpinner size={36} />
      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: '14px',
        margin: 0,
      }}>
        Carregando...
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════════════

export function Divider({ style }: { style?: CSSProperties }) {
  return (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${DS.colors.neutral.light}`,
      margin: `${DS.spacing.xl} 0`,
      ...style,
    }} />
  )
}

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
}: {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: `${DS.spacing['6xl']} ${DS.spacing.lg}`,
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1 }}>{icon}</div>
      <h3 style={{
        fontFamily: DS.typography.fontFamily.heading,
        fontSize: DS.typography.fontSize['3xl'],
        fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.text.primary,
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          fontSize: DS.typography.fontSize.lg,
          color: DS.colors.text.secondary,
          margin: '0 auto 24px',
          maxWidth: '400px',
        }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}