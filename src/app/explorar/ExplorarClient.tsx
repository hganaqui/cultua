'use client'

import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function ExplorarClient() {
  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: DS.colors.bg.primary,
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: DS.colors.text.dark, fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>
          🔍 Explorar
        </h1>
        <p style={{ color: DS.colors.text.secondary }}>
          Página em desenvolvimento...
        </p>
      </div>
    </main>
  )
}