import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MeusUploadsClient from './MeusUploadsClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { ContentWithStatus } from '@/types'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Meus Uploads — CULTUA' }

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default async function MeusUploadsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: contents } = await supabase
    .from('contents')
    .select('id, title, status, created_at, url_thumb, creator_id, category:categories(id, name, slug, color, icon, description, created_at)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <MeusUploadsClient contents={(contents ?? []) as ContentWithStatus[]} />
    </div>
  )
}