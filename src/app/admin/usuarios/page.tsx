// src/app/admin/usuarios/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'
import UsuariosClient from './UsuariosClient'
import type { AdminWithScopes, Category } from '@/types'

export default async function UsuariosPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (myProfile?.role !== 'superadmin') redirect('/admin')

  // Todos os perfis
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })

  // Emails via auth admin
  const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers()
  const emailMap = Object.fromEntries(authUsers.map(u => [u.id, u.email ?? '']))

  // Todos os escopos
  const { data: allScopes } = await supabaseAdmin
    .from('admin_scopes').select('*')

  // Categorias disponíveis
  const { data: categories } = await supabaseAdmin
    .from('categories').select('id, name, slug').order('name')

  // Todos os criadores (role user com uploads)
  const { data: creators } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  // Monta AdminWithScopes
  const users: AdminWithScopes[] = (profiles ?? []).map(p => ({
    id: p.id,
    full_name: p.full_name,
    email: emailMap[p.id] ?? '',
    role: p.role,
    created_at: p.created_at,
    scopes: {
      categories: (allScopes ?? [])
        .filter(s => s.admin_id === p.id && s.scope_type === 'category')
        .map(s => s.scope_value),
      creators: (allScopes ?? [])
        .filter(s => s.admin_id === p.id && s.scope_type === 'creator')
        .map(s => s.scope_value),
    },
  }))

  return (
    <UsuariosClient
      users={users}
      categories={(categories as Category[]) ?? []}
      allCreators={(creators ?? []).map(c => ({ id: c.id, full_name: c.full_name }))}
    />
  )
}