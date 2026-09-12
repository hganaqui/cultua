// src/proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/perfil',
  '/playlist',
  '/historico',
  '/configuracoes',
  '/admin',
  '/meus-uploads',   // ← novo
]

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/signup',
]

// Rotas que exigem role específica
const ROLE_ROUTES: { path: string; role: string }[] = [
  { path: '/admin/usuarios', role: 'superadmin' },  // ← novo
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))

  // Não logado → rota protegida → login
  if (!user && isProtected) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Já logado → login/signup → home
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verifica rotas com role específica
  const roleRoute = ROLE_ROUTES.find(r => pathname.startsWith(r.path))
  if (roleRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== roleRoute.role) {
      // Redireciona para /admin se for admin, senão home
      const fallback = profile?.role === 'admin' ? '/admin' : '/'
      return NextResponse.redirect(new URL(fallback, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}