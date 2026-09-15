import AdminClient from './AdminClient'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Painel de Curadoria — CULTUA' }

export default function AdminPage() {
  // ✅ SEM <Header /> — já vem do layout.tsx
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <AdminClient />
    </div>
  )
}