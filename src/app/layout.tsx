// ✅ app/layout.tsx (CORRIGIDO PARA PWA)

import type { Metadata, Viewport } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CULTUA — Conteúdo para edificar sua fé',
  description: 'Mais do que vídeos, uma jornada de fé.',
  manifest: '/manifest.json', // ✅ ADICIONADO
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CULTUA',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'CULTUA — Conteúdo para edificar sua fé',
    description: 'Mais do que vídeos, uma jornada de fé.',
    siteName: 'CULTUA',
    locale: 'pt_BR',
    type: 'website',
    url: 'https://cultua.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CULTUA',
    description: 'Conteúdo para edificar sua fé',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#B8860B',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        {/* ✅ Meta tags PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CULTUA" />
        <meta name="theme-color" content="#B8860B" />
        <meta name="application-name" content="CULTUA" />
        
        {/* ✅ Links PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* ✅ Splash screens iOS */}
        <link rel="apple-touch-startup-image" href="/splash-screen.png" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#F8F6EF',
        color: '#1F1F1F',
        overflowX: 'hidden',
      }}>
        {/* ✅ Service Worker Provider */}
        <ServiceWorkerProvider />
        
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}