import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {

      // ── CORES DO DESIGN SYSTEM CULTUA ──────────────────────────────
      colors: {
        // Cores primárias — brand book oficial
        cultua: {
          verde:          '#0F3D2E',   // Verde Profundo (primary.main)
          'verde-light':  '#1A5C44',   // Verde hover
          'verde-dark':   '#072619',   // Verde muito escuro
          dourado:        '#D4A373',   // Dourado Suave (accent) — brand book
          'dourado-light':'#E8C895',   // Dourado hover
          marfim:         '#F8F6EF',   // Background principal
          grafite:        '#1F1F1F',   // Texto principal
          'cinza-light':  '#E8E3DE',   // Bege claro
          'cinza-medio':  '#C9C4BE',   // Borders
          'cinza-dark':   '#6B6B6B',   // Texto secundário
          'cinza-muted':  '#C9C4BE',   // Texto muted
          'verde-natural':'#6B7F6B',   // Sucesso / verde apoio
        },

        // Status — padrão do sistema
        status: {
          success:    '#4CAF50',
          warning:    '#F59E0B',
          error:      '#EF4444',
          info:       '#3B82F6',
          pending:    '#F59E0B',
          approved:   '#4CAF50',
          rejected:   '#EF4444',
          superadmin: '#A855F7',
        },

        // Aliases diretos para uso rápido
        // ex: bg-verde, text-dourado, border-marfim
        verde:          '#0F3D2E',
        dourado:        '#D4A373',
        marfim:         '#F8F6EF',
        grafite:        '#1F1F1F',
      },

      // ── TIPOGRAFIA ─────────────────────────────────────────────────
      fontFamily: {
        // Usa as CSS vars injetadas pelo next/font no layout.tsx
        heading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        body:    ['var(--font-inter)',       'Inter',       'sans-serif'],
        // Fallback geral (sem next/font carregado)
        sans:    ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      // ── BORDER RADIUS ──────────────────────────────────────────────
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'24px',
        full: '9999px',
      },

      // ── SOMBRAS ────────────────────────────────────────────────────
      boxShadow: {
        sm:   '0 2px 8px rgba(0,0,0,0.08)',
        md:   '0 4px 16px rgba(0,0,0,0.12)',
        lg:   '0 8px 24px rgba(0,0,0,0.15)',
        xl:   '0 12px 32px rgba(0,0,0,0.20)',
        '2xl':'0 20px 60px rgba(0,0,0,0.15)',
        // Sombra verde — para botões primários
        verde:   '0 4px 16px rgba(15, 61, 46, 0.25)',
        'verde-lg': '0 8px 24px rgba(15, 61, 46, 0.30)',
        // Inner
        inner: 'inset 0 2px 8px rgba(0,0,0,0.08)',
        none:  'none',
      },

      // ── ESPAÇAMENTO EXTRA ──────────────────────────────────────────
      spacing: {
        '18': '72px',
        '22': '88px',
        '30': '120px',
      },

      // ── TAMANHOS DE FONTE ──────────────────────────────────────────
      fontSize: {
        'xs':  ['12px', { lineHeight: '16px' }],
        'sm':  ['13px', { lineHeight: '18px' }],
        'base':['14px', { lineHeight: '20px' }],
        'lg':  ['15px', { lineHeight: '22px' }],
        'xl':  ['16px', { lineHeight: '24px' }],
        '2xl': ['18px', { lineHeight: '26px' }],
        '3xl': ['20px', { lineHeight: '28px' }],
        '4xl': ['26px', { lineHeight: '34px' }],
        '5xl': ['32px', { lineHeight: '40px' }],
        '6xl': ['40px', { lineHeight: '48px' }],
        '7xl': ['56px', { lineHeight: '64px' }],
      },

      // ── ANIMAÇÕES ──────────────────────────────────────────────────
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      animation: {
        'fade-up':        'fadeUp 0.5s ease both',
        'fade-in':        'fadeIn 0.4s ease both',
        'slide-left':     'slideInLeft 0.4s ease both',
        'slide-right':    'slideInRight 0.4s ease both',
        'pulse-cultua':   'pulse 1.5s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
      },

      // ── TRANSIÇÕES ─────────────────────────────────────────────────
      transitionTimingFunction: {
        cultua: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
    },
  },

  plugins: [],
}

export default config