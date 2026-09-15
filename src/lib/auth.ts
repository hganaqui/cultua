import { supabase } from '@/lib/supabase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })
  return { data, error }
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { full_name: name.trim() },
      emailRedirectTo: `${APP_URL}/auth/callback`,
    },
  })
  
  // ✅ NOVO: Se conta criada, chama endpoint customizado
  if (data.user && !error) {
    try {
      await fetch(`${APP_URL}/api/auth/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.user.email,
          token: data.session?.access_token || 'verification-needed',
        }),
      })
    } catch (err) {
      console.error('Erro ao enviar email customizado:', err)
    }
  }

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}

// ✅ NOVO: Reset password
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/auth/reset-password`,
  })
  
  // ✅ Chamar endpoint customizado
  if (!error) {
    try {
      await fetch(`${APP_URL}/api/auth/send-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch (err) {
      console.error('Erro ao enviar email de reset:', err)
    }
  }

  return { data, error }
}

// ✅ NOVO: Update password
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  return { data, error }
}