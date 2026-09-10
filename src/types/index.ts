export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: 'user' | 'moderator' | 'admin'
  created_at: string
  updated_at: string
}

export type Content = {
  id: string
  title: string
  description: string | null
  type: 'video' | 'audio' | 'text'
  status: 'pending' | 'approved' | 'rejected'
  creator_id: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  description: string | null
  slug: string
}

export type Comment = {
  id: string
  content_id: string
  user_id: string
  text: string
  created_at: string
  updated_at: string
}

export type Playlist = {
  id: string
  user_id: string
  title: string
  description: string | null
  created_at: string
}

export type AuthError = {
  message: string
  status?: number
}

export type AuthResponse = {
  error: AuthError | null
}

export type SignUpResponse = {
  data: { user: User | null } | null
  error: AuthError | null
}

// Mapa de erros do Supabase → português
export const AUTH_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials':                  'E-mail ou senha incorretos.',
  'Email not confirmed':                        'Confirme seu e-mail antes de entrar.',
  'Too many requests':                          'Muitas tentativas. Aguarde alguns minutos.',
  'User already registered':                    'Esse e-mail já está cadastrado.',
  'Password should be at least 6 characters':  'A senha deve ter pelo menos 6 caracteres.',
  'Unable to validate email address':           'E-mail inválido.',
  'User not found':                             'Nenhuma conta encontrada com esse e-mail.',
}

export function translateAuthError(message: string): string {
  return AUTH_ERROR_MAP[message] ?? 'Erro inesperado. Tente novamente.'
}