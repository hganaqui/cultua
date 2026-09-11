// src/app/playlist/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlaylistClient from './PlaylistClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Minhas Playlists' }

export default function PlaylistPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <PlaylistClient />
      <Footer />
    </div>
  )
}