// 🎨 DESIGN SYSTEM GLOBAL - CULTUA COM CORES CORRETAS

export const DESIGN_SYSTEM = {
  colors: {
    // PRIMARY - Verde profundo + Dourado
    primary: {
      main: '#1E3A2E',        // Verde profundo
      light: '#2D5A45',       // Verde mais claro
      dark: '#0F1F1A',        // Verde muito escuro
      accent: '#D4AF7C',      // Dourado suave
    },
    
    // SECONDARY - Cores de status
    secondary: {
      success: '#6B7F68',     // Verde natural
      warning: '#D4AF7C',     // Dourado (warning)
      error: '#C84C3C',       // Vermelho-cobre
      info: '#2D5A45',        // Verde médio
    },
    
    // NEUTRAL - Cinzas e brancos
    neutral: {
      marfim: '#F8F6EF',      // Marfim claro
      light: '#E8E3DE',       // Bege claro
      medium: '#C9C4BE',      // Cinza médio
      dark: '#6B6B6B',        // Cinza escuro
      charcoal: '#3F3F3F',    // Carvão
      graphite: '#1F1F1F',    // Grafite
    },
    
    // BACKGROUND
    bg: {
      primary: '#F8F6EF',     // Marfim (fundo principal)
      secondary: '#FFFFFF',   // Branco puro
      dark: '#1E3A2E',        // Verde escuro (dark mode)
      accent: '#2D5A45',      // Verde médio
    },
    
    // TEXT
    text: {
      dark: '#1F1F1F',        // Grafite - texto principal
      light: '#FFFFFF',       // Branco - texto em fundo escuro
      primary: '#1F1F1F',     // Grafite
      secondary: '#6B6B6B',   // Cinza escuro
      muted: '#C9C4BE',       // Cinza médio
      accent: '#D4AF7C',      // Dourado - destaques
    }
  },

  typography: {
    fontFamily: {
      main: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      lg: '15px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '20px',
      '4xl': '26px',
      '5xl': '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.08)',
    md: '0 4px 16px rgba(0,0,0,0.12)',
    lg: '0 8px 24px rgba(0,0,0,0.15)',
    xl: '0 12px 32px rgba(0,0,0,0.2)',
    '2xl': '0 20px 60px rgba(0,0,0,0.15)',
  },

  transitions: {
    base: 'all 0.3s ease',
  },
}