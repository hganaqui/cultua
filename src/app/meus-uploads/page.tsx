// src/app/meus-uploads/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MeusUploadsClient from './MeusUploadsClient'
import type { ContentWithStatus } from '@/types'

export const metadata = { title: 'Meus Uploads — CULTUA' }

export default async function MeusUploadsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: contents } = await supabase
    .from('contents')
    .select('id, title, status, created_at, url_thumb, creator_id, category:categories(name)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  return <MeusUploadsClient contents={(contents ?? []) as ContentWithStatus[]} />
}