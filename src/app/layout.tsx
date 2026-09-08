import type { Metadata } from 'next'
import { CULTUA_CONFIG } from '@/lib/cultua-config'
import '@/styles/globals.css'
import '@/styles/cultua.css'

export const metadata: Metadata = {
  title: {
    default: `${CULTUA_CONFIG.app.name} - ${CULTUA_CONFIG.app.tagline}`,
    template: `%s | ${CULTUA_CONFIG.app.name}`,
  },
  description: CULTUA_CONFIG.app.description,
  keywords: [
    'cristão',
    'conteúdo cristão',
    'louvor',
    'pregação',
    'devocional',
    'sem anúncios',
    'comunidade cristã',
  ],
  authors: [{ name: 'CULTUA' }],
  creator: 'CULTUA',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: CULTUA_CONFIG.urls.base,
    siteName: CULTUA_CONFIG.app.name,
    title: `${CULTUA_CONFIG.app.name} - ${CULTUA_CONFIG.app.tagline}`,
    description: CULTUA_CONFIG.app.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={CULTUA_CONFIG.colors.primary.main} />
      </head>
      <body style={{
        backgroundColor: CULTUA_CONFIG.colors.background,
        color: CULTUA_CONFIG.colors.text.primary,
        fontFamily: CULTUA_CONFIG.typography.fontFamily.body,
      }}>
        {children}
      </body>
    </html>
  )
}