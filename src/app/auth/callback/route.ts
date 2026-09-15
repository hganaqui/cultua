import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // ✅ Se tiver erro no callback
  if (error || error_description) {
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(
          error_description || error || 'Erro na confirmação'
        )}`,
        request.url
      )
    )
  }

  // ✅ Se tiver code, trocar por sessão
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
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // ✅ Sucesso → vai para página de sucesso
      return NextResponse.redirect(
        new URL('/auth/success', request.url)
      )
    }

    // ✅ Erro ao trocar code
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(
          exchangeError?.message || 'Erro ao confirmar email'
        )}`,
        request.url
      )
    )
  }

  // ✅ Sem code — link inválido
  return NextResponse.redirect(
    new URL(
      '/auth/error?message=Link inválido ou expirado',
      request.url
    )
  )
}