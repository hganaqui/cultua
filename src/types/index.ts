// src/types/index.ts — substituir o conteúdo completo

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'moderator' | 'admin'
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  created_at: string
}

export type Content = {
  id: string
  title: string
  description: string | null
  type: 'video' | 'audio' | 'text'
  status: 'pending' | 'approved' | 'rejected'
  url_media: string | null
  url_thumb: string | null
  duration: string | null
  category_id: string | null
  creator_id: string | null
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
  // joins
  category?: Category
  creator?: Pick<User, 'id' | 'full_name' | 'avatar_url'>
}

export type WatchHistory = {
  id: string
  user_id: string
  content_id: string
  progress_sec: number
  completed: boolean
  watched_at: string
  content?: Content
}

export type Playlist = {
  id: string
  user_id: string
  title: string
  description: string | null
  public: boolean
  created_at: string
  updated_at: string
}

export type PlaylistItem = {
  playlist_id: string
  content_id: string
  position: number
  added_at: string
  content?: Content
}

// ── Auth helpers ─────────────────────────────────────────────

export type AuthError = {
  message: string
  status?: number
}

export const AUTH_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials':                 'E-mail ou senha incorretos.',
  'Email not confirmed':                       'Confirme seu e-mail antes de entrar.',
  'Too many requests':                         'Muitas tentativas. Aguarde alguns minutos.',
  'User already registered':                   'Esse e-mail já está cadastrado.',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
  'Unable to validate email address':          'E-mail inválido.',
  'User not found':                            'Nenhuma conta encontrada com esse e-mail.',
}

export function translateAuthError(message: string): string {
  return AUTH_ERROR_MAP[message] ?? 'Erro inesperado. Tente novamente.'
}