// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ─── Cliente Supabase para Server Components ──────────────────────────────────
// Use quando precisar fazer queries além de auth (ex: generateMetadata, pages)
export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // server component não precisa setar
      },
    }
  )
}

// ─── Só o user autenticado ────────────────────────────────────────────────────
// Mantém retrocompatibilidade — todos os lugares que já usam getServerUser() continuam funcionando
export async function getServerUser() {
  const supabase = await createServerSupabase() // reutiliza, sem duplicar código
  const { data: { user } } = await supabase.auth.getUser()
  return user
}