import PlaylistClient from './PlaylistClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Minhas Playlists — CULTUA' }

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function PlaylistPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <PlaylistClient />
    </div>
  )
}