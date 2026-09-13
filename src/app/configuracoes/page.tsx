import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfiguracoesClient from './ConfiguracoesClient'
import type { Metadata } from 'next'
import type { Profile } from '@/types'

export const metadata: Metadata = { title: 'Configurações — CULTUA' }
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/configuracoes')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('📊 Profile do servidor:', profile, 'Erro:', error)

  const safeProfile: Profile = profile ?? {
    id: user.id,
    full_name: user.email?.split('@')[0] || 'Usuário',
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