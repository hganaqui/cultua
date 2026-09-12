// src/app/api/admin/scopes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Verifica se quem chama é superadmin
async function assertSuperadmin() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401, user: null, supabase }

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'superadmin') 
    return { error: 'Forbidden', status: 403, user: null, supabase }

  return { error: null, status: 200, user, supabase }
}

// GET /api/admin/scopes?admin_id=xxx
export async function GET(req: NextRequest) {
  const { error, status } = await assertSuperadmin()
  if (error) return NextResponse.json({ error }, { status })

  const adminId = req.nextUrl.searchParams.get('admin_id')
  if (!adminId) return NextResponse.json({ error: 'admin_id obrigatório' }, { status: 400 })

  const { data, error: dbError } = await supabaseAdmin
    .from('admin_scopes').select('*').eq('admin_id', adminId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ scopes: data })
}

// POST /api/admin/scopes → adiciona escopo
export async function POST(req: NextRequest) {
  const { error, status, user } = await assertSuperadmin()
  if (error || !user) return NextResponse.json({ error }, { status })

  const { admin_id, scope_type, scope_value } = await req.json()

  if (!['category', 'creator'].includes(scope_type))
    return NextResponse.json({ error: 'scope_type inválido' }, { status: 400 })
  if (!admin_id || !scope_value)
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })

  const { error: dbError } = await supabaseAdmin
    .from('admin_scopes')
    .upsert(
      { admin_id, scope_type, scope_value, granted_by: user.id },
      { onConflict: 'admin_id,scope_type,scope_value' }
    )

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/scopes → remove escopo
export async function DELETE(req: NextRequest) {
  const { error, status } = await assertSuperadmin()
  if (error) return NextResponse.json({ error }, { status })

  const { admin_id, scope_type, scope_value } = await req.json()

  if (!admin_id || !scope_type || !scope_value)
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })

  const { error: dbError } = await supabaseAdmin
    .from('admin_scopes')
    .delete()
    .match({ admin_id, scope_type, scope_value })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}