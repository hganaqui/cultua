import { createServerSupabase } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { full_name, avatar_url } = await req.json()

    // ✅ Atualiza ou cria
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: full_name || user.email?.split('@')[0] || 'Usuário',
        avatar_url: avatar_url || null,
        role: 'user',
        managed_categories: null,
        managed_creators: null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('Erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}