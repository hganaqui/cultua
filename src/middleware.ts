// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas que exigem login — browse é livre
const PROTECTED_ROUTES = [
  '/perfil',
  '/playlist',
  '/historico',
  '/configuracoes',
]

// Rotas que usuário logado NÃO deve acessar (ex: já está logado, não precisa do /login)
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/signup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cria response mutável para o Supabase SSR poder escrever cookies
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Sempre chama getUser() para refresh automático do token
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))

  // Não logado tentando acessar rota protegida → redirect para login
  if (!user && isProtected) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname) // guarda pra onde voltar
    return NextResponse.redirect(loginUrl)
  }

  // Já logado tentando acessar login/signup → redirect para home
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  // Roda o middleware só nas rotas relevantes — ignora _next, assets, etc.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}