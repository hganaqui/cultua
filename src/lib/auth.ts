// src/lib/auth.ts — ARQUIVO NOVO
// Usa o `supabase` que já existe em lib/supabase.ts
// NÃO duplica cliente

import supabase from '@/lib/supabase'
import type { User } from '@/types'

// ── Login ──────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })
  return { data, error }
}

// ── Cadastro ───────────────────────────────────────────────────────────────
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: name.trim(),   // → auth.users.raw_user_meta_data
      },
    },
  })
  return { data, error }
}

// ── Logout ─────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// ── Sessão atual ───────────────────────────────────────────────────────────
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

// ── Usuário atual ──────────────────────────────────────────────────────────
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}