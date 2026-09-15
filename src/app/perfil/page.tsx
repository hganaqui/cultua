import PerfilClient from './PerfilClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Meu Perfil — CULTUA' }

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function PerfilPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <PerfilClient />
    </div>
  )
}