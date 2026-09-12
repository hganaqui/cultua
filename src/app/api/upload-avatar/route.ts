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

  if (!file.type.startsWith('image/'))
    return NextResponse.json({ error: 'Somente imagens' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024)
    return NextResponse.json({ error: 'Máximo 2MB' }, { status: 400 })

  const ext  = file.name.split('.').pop() ?? 'jpg'
  // ✅ path simples — só o arquivo, SEM subpasta
  // dentro do bucket 'avatars', o path é apenas '{userId}.{ext}'
  const path = `${user.id}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('avatars')  // ← bucket
    .upload(path, buffer, {  // ← path dentro do bucket (sem 'avatars/')
      upsert: true,
      contentType: file.type,
      cacheControl: '3600',
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // ✅ URL pública sem duplicação
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const publicUrl   = `${supabaseUrl}/storage/v1/object/public/avatars/${path}`

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 })

  return NextResponse.json({ url: publicUrl })
}