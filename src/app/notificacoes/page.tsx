import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificacoesClient from './NotificacoesClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = {
  title: 'Notificações',
  description: 'Suas notificações sobre conteúdo aprovado e rejeitado',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NotificacoesPage() {
  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <NotificacoesClient userId={user.id} />
      <Footer />
    </div>
  )
}