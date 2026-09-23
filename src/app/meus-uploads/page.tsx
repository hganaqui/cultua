// ✅ meus-uploads/page.tsx (CORRIGIDO)

import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MeusUploadsClient from './MeusUploadsClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { ContentWithStatus } from '@/types'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Meus Uploads — CULTUA' }

export default async function MeusUploadsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: rawContents } = await supabase
    .from('contents')
    .select('id, title, status, created_at, url_thumb, creator_id, category:categories(id, name, slug, color, icon, description, created_at)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  // ✅ MAPEAR category: [] → category: null
  const contents: ContentWithStatus[] = (rawContents ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    status: item.status === 'approved' ? 'published' : item.status,
    created_at: item.created_at,
    url_thumb: item.url_thumb,
    creator_id: item.creator_id,
    category: Array.isArray(item.category)
      ? item.category[0] ?? null
      : item.category ?? null,
    content_tags: item.content_tags ?? [],
  }))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <MeusUploadsClient contents={contents} />
    </div>
  )
}