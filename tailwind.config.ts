import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        copper: {
          200: '#e8c39e',
          400: '#ca7a33',
          500: '#b8631b',
        },
      },
    },
  },
  plugins: [],
}

export default config