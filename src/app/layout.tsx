import type { Metadata } from 'next'
import { CULTUA_CONFIG } from '@/lib/cultua-config'
import '@/styles/globals.css'
import '@/styles/cultua.css'

export const metadata: Metadata = {
  title: {
    default: 'CULTUA - Conteúdo para alimentar sua fé',  // era: "Celebre sua fé sem distrações"
    template: '%s | CULTUA',
  },
  description: 'Plataforma cristã com pregações, louvores, devocionais e testemunhos. Conteúdo curado para edificar sua fé.',
keywords: ['cristão', 'louvor', 'pregação', 'devocional', 'testemunhos', 'curadoria', 'fé'],
  authors: [{ name: 'CULTUA' }],
  creator: 'CULTUA',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://cultua.vercel.app',
    siteName: 'CULTUA',
title: 'CULTUA - Conteúdo para alimentar sua fé',
    description: 'Pregações, louvores, devocionais e testemunhos. Curado para edificar.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'CULTUA',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#B8860B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CULTUA" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}