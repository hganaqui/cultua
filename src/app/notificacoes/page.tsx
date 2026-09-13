// src/app/notificacoes/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificacoesClient from './NotificacoesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notificações',
  description: 'Suas notificações sobre conteúdo aprovado e rejeitado',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NotificacoesPage() {
  const supabase = await createServerSupabase()

  // ✅ Verificar se usuário está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <Header />
      <NotificacoesClient userId={user.id} />
      <Footer />
    </div>
  )
}