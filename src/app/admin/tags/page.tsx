import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminTagsClient from './AdminTagsClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = {
  title: 'Gerenciar Temas - Admin',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminTagsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <AdminTagsClient />
      <Footer />
    </div>
  )
}