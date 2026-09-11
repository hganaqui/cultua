// src/app/admin/page.tsx
import Header from '@/components/Header'
import AdminClient from './AdminClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Painel de Curadoria' }

export default function AdminPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1A' }}>
      <Header />
      <AdminClient />
    </div>
  )
}