// src/app/configuracoes/page.tsx — Server Component (sem 'use client')
import { getServerUser } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfiguracoesClient from './ConfiguracoesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Configurações' }

export default async function ConfiguracoesPage() {
  const user = await getServerUser()
  if (!user) redirect('/auth/login?redirect=/configuracoes')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <ConfiguracoesClient />  {/* ← toda a interatividade aqui */}
      <Footer />
    </div>
  )
}