// src/lib/cultua-config.ts
/**
 * CULTUA - Configurações Globais da Plataforma
 */

export const CULTUA_CONFIG = {
  app: {
    name: 'CULTUA',
    description: 'Celebre sua fé sem distrações',
    tagline: 'Conteúdo cristão 100% sem interrupções',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  urls: {
    base: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    production: 'https://cultua.vercel.app',
  },

  colors: {
    primary: {
      main: '#B8860B',
      light: '#D4AF37',
      dark: '#8B6914',
      50: '#FEF9E8',
      100: '#FDF0CC',
      200: '#FCDEA3',
      300: '#FBCE7A',
      400: '#F9BA4A',
      500: '#B8860B',
      600: '#A07A0A',
      700: '#886D09',
      800: '#706008',
      900: '#584E07',
    },

    secondary: {
      main: '#1A1A1A',
      light: '#333333',
      dark: '#000000',
    },

    accent: {
      main: '#D4AF37',
      light: '#E8C547',
      dark: '#B8860B',
    },

    success: '#4CAF50',
    warning: '#FF6B35',
    error: '#E74C3C',
    info: '#1A3A52',
    
    gray: {
      50: '#F9FAFB',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    background: '#F5F5F5',
    surface: '#FFFFFF',
    
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      tertiary: '#999999',
      light: '#CCCCCC',
    },

    border: '#E0E0E0',
  },

  typography: {
    fontFamily: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Courier New", Courier, monospace',
    },

    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '36px',
      '5xl': '48px',
    },

    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    none: 'none',
  },

  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  pagination: {
    itemsPerPage: 12,
    videosPerPage: 12,
    commentsPerPage: 10,
  },

// src/lib/cultua-config.ts
// Só o array categories muda — resto do arquivo igual

categories: [
  {
    id: 'louvor',
    name: 'Louvor',
    description: 'Músicas de louvor e adoração',
    icon: '🎵',
    color: '#B8860B',
    slug: 'louvor',
  },
  {
    id: 'pregacao',
    name: 'Pregação',
    description: 'Pregações e mensagens',
    icon: '📖',
    color: '#D4AF37',
    slug: 'pregacao',
  },
  {
    // FASE 0: comunidade → testemunhos (alinhado com CategorySection.tsx)
    id: 'testemunhos',
    name: 'Testemunhos',
    description: 'Histórias reais de fé e transformação',
    icon: '🙏',
    color: '#7C3AED',
    slug: 'testemunhos',
  },
  {
    id: 'crescimento',
    name: 'Crescimento',
    description: 'Devocionais e estudos',
    icon: '🌱',
    color: '#4CAF50',
    slug: 'crescimento',
  },
],

  features: {
    authentication: true,
    comments: false,
    playlists: false,
    upload: false,
    monetization: false,
    transcription: false,
    mobileApp: false,
  },
}

export const getCategoryById = (id: string) => {
  return CULTUA_CONFIG.categories.find(cat => cat.id === id)
}

export const getCategoryBySlug = (slug: string) => {
  return CULTUA_CONFIG.categories.find(cat => cat.slug === slug)
}

export const getAllCategories = () => {
  return CULTUA_CONFIG.categories
}

export const getPrimaryColor = () => {
  return CULTUA_CONFIG.colors.primary.main
}

export const getSecondaryColor = () => {
  return CULTUA_CONFIG.colors.secondary.main
}

export const getAccentColor = () => {
  return CULTUA_CONFIG.colors.accent.main
}