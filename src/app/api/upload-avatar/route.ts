// src/app/api/upload-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('avatar') as File | null
  
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  // Valida tipo e tamanho (max 2MB)
  if (!file.type.startsWith('image/')) 
    return NextResponse.json({ error: 'Somente imagens' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024) 
    return NextResponse.json({ error: 'Máximo 2MB' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `avatars/${user.id}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  // Upload para Supabase Storage (bucket 'avatars', público)
  const { error: uploadError } = await supabaseAdmin.storage
    .from('avatars')
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('avatars')
    .getPublicUrl(path)

  // Salva URL no profile
  await supabaseAdmin
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  return NextResponse.json({ url: publicUrl })
}