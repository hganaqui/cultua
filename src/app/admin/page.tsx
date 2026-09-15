import Header from '@/components/Header'
import AdminClient from './AdminClient'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Painel de Curadoria' }

export default function AdminPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <AdminClient />
    </div>
  )
}