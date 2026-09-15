import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
  openGraph: {
    title: 'CULTUA — Conteúdo para edificar sua fé',
    description: 'Mais do que vídeos, uma jornada de fé.',
    siteName: 'CULTUA',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable}`}>
      <body style={{
        margin: 0, padding: 0,
        fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#F8F6EF',
        color: '#1F1F1F',
        overflowX: 'hidden',
      }}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}