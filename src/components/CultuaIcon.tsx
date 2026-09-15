// src/components/CultuaIcon.tsx
// Ícones estilo próprio CULTUA — brand book item 06 + 07
// Linha fina, verde profundo, sem dependência externa

import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export type CultuaIconName =
  | 'louvor'
  | 'pregacao'
  | 'crescimento'
  | 'testemunhos'
  | 'oracao'
  | 'familia'
  | 'estudos'
  | 'explorar'
  | 'play'
  | 'pause'
  | 'busca'
  | 'perfil'
  | 'biblioteca'
  | 'inicio'
  | 'notificacao'
  | 'seta-direita'
  | 'fechar'
  | 'check'

interface CultuaIconProps {
  name: CultuaIconName
  size?: number
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
  'aria-hidden'?: boolean
}

const ICONS: Record<CultuaIconName, (sw: number) => React.ReactNode> = {

  // 🎵 Louvor — nota musical
  louvor: (sw) => (
    <path
      d="M9 3v7a2 2 0 1 1-2-2h0V3l4-1v1"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),

  // 📖 Pregação — livro aberto
  pregacao: (sw) => (
    <>
      <path d="M2 4a2 2 0 0 1 2-2h3v14H4a2 2 0 0 1-2-2V4Z" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" fill="none" />
      <path d="M13 2h-3v14h3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" fill="none" />
      <path d="M7 4v14" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // 🌱 Crescimento — broto
  crescimento: (sw) => (
    <>
      <path d="M5 20c0-6 3-10 7-12" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <path d="M12 8C12 5 14 3 17 3c0 4-2 7-5 7" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 12c0-3-2-5-5-6 0 4 2 7 5 7" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  // 👥 Testemunhos — pessoas
  testemunhos: (sw) => (
    <>
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth={sw} fill="none" />
      <path d="M3 20c0-4 3-6 6-6s6 2 6 6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" fill="none" />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth={sw} fill="none" />
      <path d="M17 14c1.5 0 4 1 4 5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" fill="none" />
    </>
  ),

  // 🙏 Oração — mãos unidas
  oracao: (sw) => (
    <>
      <path d="M12 2L8 8v6l4 4 4-4V8L12 2Z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M8 8H5l-2 4 4 4" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 8h3l2 4-4 4" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 14v6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // 🏠 Família — casa com coração
  familia: (sw) => (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 13c0 0-3-2-3-3.5a1.5 1.5 0 0 1 3-.75 1.5 1.5 0 0 1 3 .75C15 11 12 13 12 13Z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  // 📚 Estudos — lupa + livro
  estudos: (sw) => (
    <>
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth={sw} fill="none" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <path d="M7 10h6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <path d="M10 7v6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // 🔲 Explorar — grid
  explorar: (sw) => (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
    </>
  ),

  // ▶️ Play
  play: (sw) => (
    <path d="M6 4l14 8-14 8V4Z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),

  // ⏸️ Pause
  pause: (sw) => (
    <>
      <rect x="6" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
      <rect x="14" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
    </>
  ),

  // 🔍 Busca
  busca: (sw) => (
    <>
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth={sw} fill="none" />
      <path d="M20 20l-4.5-4.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // 👤 Perfil
  perfil: (sw) => (
    <>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={sw} fill="none" />
      <path d="M4 20c0-5 3.5-8 8-8s8 3 8 8" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" fill="none" />
    </>
  ),

  // 📚 Biblioteca
  biblioteca: (sw) => (
    <>
      <rect x="4" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
      <rect x="10" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth={sw} fill="none" />
      <path d="M16 3l4 18" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // 🏠 Início
  inicio: (sw) => (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  // 🔔 Notificação
  notificacao: (sw) => (
    <>
      <path d="M6 8a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7Z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10.3 21a2 2 0 0 0 3.4 0" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // → Seta direita
  'seta-direita': (sw) => (
    <>
      <path d="M5 12h14" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // ✕ Fechar
  fechar: (sw) => (
    <>
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </>
  ),

  // ✓ Check
  check: (sw) => (
    <path d="M4 12l5 5 11-10" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
}

export default function CultuaIcon({
  name,
  size = 24,
  color = DS.colors.primary.main,
  strokeWidth = 1.5,
  style,
  'aria-hidden': ariaHidden = true,
}: CultuaIconProps) {
  const paths = ICONS[name]

  if (!paths) {
    console.warn(`[CultuaIcon] ícone "${name}" não encontrado`)
    return null
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color, flexShrink: 0, ...style }}
      aria-hidden={ariaHidden}
    >
      {paths(strokeWidth)}
    </svg>
  )
}