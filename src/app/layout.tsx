import type { Metadata } from 'next'
import { CULTUA_CONFIG } from '@/lib/cultua-config'
import '@/styles/globals.css'
import '@/styles/cultua.css'

export const metadata: Metadata = {
  title: {
    default: 'CULTUA - Celebre sua fé sem distrações',
    template: '%s | CULTUA',
  },
  description: 'Plataforma cristã de conteúdo 100% sem interrupções',
  icons: {
    icon: '/logo-cultua.jpg',
    apple: '/logo-cultua.jpg',
    shortcut: '/logo-cultua.jpg',
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
        <link rel="icon" href="/logo-cultua.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo-cultua.jpg" />
        <meta name="theme-color" content="#B8860B" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}