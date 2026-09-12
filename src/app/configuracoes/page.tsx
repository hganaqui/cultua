// src/app/configuracoes/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfiguracoesClient from './ConfiguracoesClient'
import type { Metadata } from 'next'
import type { Profile } from '@/types'

export const metadata: Metadata = { title: 'Configurações — CULTUA' }

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/configuracoes')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, managed_categories, managed_creators, created_at')
    .eq('id', user.id)
    .single()

  const safeProfile: Profile = profile ?? {
    id: user.id,
    full_name: null,
    avatar_url: null,
    role: 'user',
    managed_categories: null,
    managed_creators: null,
    created_at: new Date().toISOString(),
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <ConfiguracoesClient
        profile={safeProfile}
        email={user.email ?? ''}
      />
      <Footer />
    </div>
  )
}