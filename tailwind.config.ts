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
      colors: {
        copper: {
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
        gold: '#D4AF37',
        success: '#4CAF50',
        warning: '#FF6B35',
        error: '#E74C3C',
        info: '#1A3A52',
        background: '#F5F5F5',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}

export default config