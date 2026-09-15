import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ConfiguracoesClient from './ConfiguracoesClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'
import type { Profile } from '@/types'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Configurações — CULTUA' }
export const revalidate = 0
export const dynamic    = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/configuracoes')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const safeProfile: Profile = profile ?? {
    id:                 user.id,
    full_name:          user.email?.split('@')[0] ?? 'Usuário',
    avatar_url:         null,
    role:               'user',
    managed_categories: null,
    managed_creators:   null,
    created_at:         new Date().toISOString(),
  }

  // ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <ConfiguracoesClient profile={safeProfile} email={user.email ?? ''} />
    </div>
  )
}