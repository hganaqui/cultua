import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import NotificacoesClient from './NotificacoesClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = {
  title: 'Notificações — CULTUA',
  description: 'Suas notificações sobre conteúdo aprovado e rejeitado',
}

export const dynamic   = 'force-dynamic'
export const revalidate = 0

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default async function NotificacoesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <NotificacoesClient userId={user.id} />
    </div>
  )
}