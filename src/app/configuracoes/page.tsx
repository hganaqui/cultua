import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfiguracoesClient from './ConfiguracoesClient'
import type { Metadata } from 'next'
import type { Profile } from '@/types'

export const metadata: Metadata = { title: 'Configurações — CULTUA' }
export const revalidate = 0

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/configuracoes')

  // ✅ Tenta buscar o perfil
  let profile = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, managed_categories, managed_creators, created_at')
    .eq('id', user.id)
    .single()

  // ✅ Se não encontrar, cria um novo
  if (!profile.data) {
    console.log('Criando novo perfil para:', user.id)
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
        avatar_url: user.user_metadata?.avatar_url || null,
        role: 'user',
        managed_categories: null,
        managed_creators: null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    profile.data = newProfile
  }

  const safeProfile: Profile = profile.data ?? {
    id: user.id,
    full_name: user.email?.split('@')[0] || 'Usuário',
    avatar_url: null,
    role: 'user',
    managed_categories: null,
    managed_creators: null,
    created_at: new Date().toISOString(),
  }

  console.log('✅ Profile carregado:', safeProfile)

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