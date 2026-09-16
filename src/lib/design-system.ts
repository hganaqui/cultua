// 🎨 DESIGN SYSTEM GLOBAL - CULTUA
// Fonte de verdade: CULTUA_Guia_de_Implementacao.pdf
// Verde Profundo: #0F3D2E | Dourado: #D4A373 | Marfim: #F8F6EF

export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      main: '#0F3D2E',        // Verde Profundo — brand book oficial
      light: '#1A5C44',       // Verde mais claro para hover
      dark: '#072619',        // Verde muito escuro
      accent: '#D4A373',      // Dourado Suave — brand book oficial
      accentLight: '#E8C895', // Dourado claro para hover
    },

    secondary: {
      success: '#6B7F6B',     // Verde Natural
      warning: '#D4A373',     // Dourado
      error: '#C84C3C',       // Vermelho-cobre
      info: '#1A5C44',        // Verde médio
    },

    neutral: {
      marfim: '#F8F6EF',      // Marfim — fundo principal
      light: '#E8E3DE',       // Bege claro
      medium: '#C9C4BE',      // Cinza médio — borders
      dark: '#6B6B6B',        // Cinza escuro — texto secundário
      charcoal: '#3F3F3F',    // Carvão
      graphite: '#1F1F1F',    // Grafite — texto principal
    },

    bg: {
      primary: '#F8F6EF',     // Marfim
      secondary: '#FFFFFF',   // Branco puro — cards, inputs
      dark: '#0F3D2E',        // Verde Profundo — dark sections
      card: '#FFFFFF',        // Cards
    },

    text: {
      dark: '#1F1F1F',
      light: '#FFFFFF',
      primary: '#1F1F1F',
      secondary: '#6B6B6B',
      muted: '#C9C4BE',
      accent: '#D4A373',
    },

    status: {
      pending: '#F59E0B',
      approved: '#4CAF50',
      rejected: '#EF4444',
      superadmin: '#A855F7',
    },
  },

  typography: {
    fontFamily: {
      heading: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      // fallback enquanto fonts carregam
      main: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
      '6xl': '40px',
      '7xl': '56px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.7,
    },
    letterSpacing: {
      tight: '-1px',
      normal: '0px',
      wide: '1px',
      wider: '2px',
      widest: '4px',
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
    '6xl': '64px',
    '7xl': '80px',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.08)',
    md: '0 4px 16px rgba(0,0,0,0.12)',
    lg: '0 8px 24px rgba(0,0,0,0.15)',
    xl: '0 12px 32px rgba(0,0,0,0.2)',
    '2xl': '0 20px 60px rgba(0,0,0,0.15)',
    inner: 'inset 0 2px 8px rgba(0,0,0,0.08)',
  },

  transitions: {
    fast: 'all 0.15s ease',
    base: 'all 0.25s ease',
    slow: 'all 0.4s ease',
  },
tags: {
    alegria: {
      name: 'Alegria',
      slug: 'alegria',
      color: '#FFD700',
      icon: '/icons/alegria.svg',
      text_color: '#1F1F1F',
      description: 'Conteúdo que traz alegria e esperança',
    },
    ansiedade: {
      name: 'Ansiedade',
      slug: 'ansiedade',
      color: '#FF6B6B',
      icon: '/icons/ansiedade.svg',
      text_color: '#FFFFFF',
      description: 'Apoio espiritual para ansiedade',
    },
    autoestima: {
      name: 'Autoestima',
      slug: 'autoestima',
      color: '#FF9FF3',
      icon: '/icons/autoestima.svg',
      text_color: '#FFFFFF',
      description: 'Fortaleça sua autoestima em Cristo',
    },
    crescimento: {
      name: 'Crescimento',
      slug: 'crescimento',
      color: '#0F3D2E',
      icon: '/icons/crescimento.svg',
      text_color: '#FFFFFF',
      description: 'Crescimento espiritual e pessoal',
    },
    depressao: {
      name: 'Depressão',
      slug: 'depressao',
      color: '#4B5563',
      icon: '/icons/depressao.svg',
      text_color: '#FFFFFF',
      description: 'Esperança e cura para depressão',
    },
    esperanca: {
      name: 'Esperança',
      slug: 'esperanca',
      color: '#74B9FF',
      icon: '/icons/esperanca.svg',
      text_color: '#1F1F1F',
      description: 'Renovação de esperança em Deus',
    },
    espiritualidade: {
      name: 'Espiritualidade',
      slug: 'espiritualidade',
      color: '#9B59B6',
      icon: '/icons/espiritualidade.svg',
      text_color: '#FFFFFF',
      description: 'Aprofunde sua vida espiritual',
    },
    estudos: {
      name: 'Estudos',
      slug: 'estudos',
      color: '#6B7F6B',
      icon: '/icons/estudos.svg',
      text_color: '#FFFFFF',
      description: 'Estudos bíblicos e devocionais',
    },
    explorar: {
      name: 'Explorar',
      slug: 'explorar',
      color: '#3498DB',
      icon: '/icons/explorar.svg',
      text_color: '#FFFFFF',
      description: 'Descubra novo conteúdo',
    },
    familia: {
      name: 'Família',
      slug: 'familia',
      color: '#D4AF7C',
      icon: '/icons/familia.svg',
      text_color: '#1F1F1F',
      description: 'Relacionamentos e vida familiar',
    },
    louvor: {
      name: 'Louvor',
      slug: 'louvor',
      color: '#7C3AED',
      icon: '/icons/louvor.svg',
      text_color: '#FFFFFF',
      description: 'Louvor e adoração',
    },
    oracao: {
      name: 'Oração',
      slug: 'oracao',
      color: '#3FC97A',
      icon: '/icons/oracao.svg',
      text_color: '#FFFFFF',
      description: 'Poder transformador da oração',
    },
    paz: {
      name: 'Paz',
      slug: 'paz',
      color: '#26D0CE',
      icon: '/icons/paz.svg',
      text_color: '#FFFFFF',
      description: 'Paz que ultrapassa entendimento',
    },
    perdao: {
      name: 'Perdão',
      slug: 'perdao',
      color: '#F39C12',
      icon: '/icons/perdao.svg',
      text_color: '#FFFFFF',
      description: 'Graça e perdão em Cristo',
    },
    pregacao: {
      name: 'Pregação',
      slug: 'pregacao',
      color: '#D4A373',
      icon: '/icons/pregacao.svg',
      text_color: '#1F1F1F',
      description: 'Pregações inspiradoras',
    },
    relacionamentos: {
      name: 'Relacionamentos',
      slug: 'relacionamentos',
      color: '#E74C3C',
      icon: '/icons/relacionamentos.svg',
      text_color: '#FFFFFF',
      description: 'Relacionamentos saudáveis',
    },
    saude: {
      name: 'Saúde',
      slug: 'saude',
      color: '#27AE60',
      icon: '/icons/saude.svg',
      text_color: '#FFFFFF',
      description: 'Saúde mental, física e espiritual',
    },
    testemunhos: {
      name: 'Testemunhos',
      slug: 'testemunhos',
      color: '#D97706',
      icon: '/icons/testemunhos.svg',
      text_color: '#FFFFFF',
      description: 'Histórias de transformação',
    },
  } as const,
} as const

export type DesignSystem = typeof DESIGN_SYSTEM
export type TagKey = keyof typeof DESIGN_SYSTEM.tags
