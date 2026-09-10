// src/app/auth/callback/route.ts — ARQUIVO NOVO
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Troca o code por uma sessão válida
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // ✅ Confirmado → vai para home logado
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Erro → vai para login com mensagem
  return NextResponse.redirect(
    new URL('/auth/login?error=confirmation_failed', request.url)
  )
}