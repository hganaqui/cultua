// src/types/index.ts

// ═══════════════════════════════════════════════════════════════════
// ROLES
// ═══════════════════════════════════════════════════════════════════

export type UserRole = 'user' | 'admin' | 'superadmin'

// ═══════════════════════════════════════════════════════════════════
// USER / PROFILE
// ═══════════════════════════════════════════════════════════════════

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  managed_categories: string[] | null   // IDs de categorias (legado, substituído por admin_scopes)
  managed_creators: string[] | null     // IDs de criadores  (legado, substituído por admin_scopes)
  created_at: string
  updated_at: string
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY
// ═══════════════════════════════════════════════════════════════════

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  created_at: string
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════

export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type ContentType   = 'video' | 'audio' | 'text'

export type Content = {
  id: string
  title: string
  description: string | null
  type: ContentType
  status: ContentStatus
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
  category?: Category | { name: string } | null
  creator?: Pick<User, 'id' | 'full_name' | 'avatar_url'> | null
}

/** Shape mínimo usado em /meus-uploads */
export type ContentWithStatus = {
  id: string
  title: string
  status: string
  creator_id: string | null
  created_at: string
  url_thumb: string | null
  category: { name: string } | { name: string }[] | null
}

// ═══════════════════════════════════════════════════════════════════
// WATCH HISTORY
// ═══════════════════════════════════════════════════════════════════

export type WatchHistory = {
  id: string
  user_id: string
  content_id: string
  progress_sec: number
  completed: boolean
  watched_at: string
  content?: Content
}

// ═══════════════════════════════════════════════════════════════════
// PLAYLIST
// ═══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════

export type NotificationType =
  | 'pending_content'
  | 'content_approved'
  | 'content_rejected'

export type Notification = {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string | null
  read: boolean
  metadata: Record<string, unknown> | null
  created_at: string
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN SCOPES
// ═══════════════════════════════════════════════════════════════════

export type ScopeType = 'category' | 'creator'

export type AdminScope = {
  id: string
  admin_id: string
  scope_type: ScopeType
  scope_value: string   // UUID da category ou do creator
  granted_by: string | null
  created_at: string
}

export type AdminScopes = {
  categories: string[]  // category IDs
  creators: string[]    // creator/user IDs
}

/** Usuário com escopos resolvidos — usado no painel superadmin */
export type AdminWithScopes = {
  id: string
  full_name: string | null
  email: string
  role: UserRole
  created_at: string
  scopes: AdminScopes
}

/** Criador mínimo para selects/dropdowns */
export type CreatorOption = {
  id: string
  full_name: string | null
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE (retorno do Supabase em joins)
// ═══════════════════════════════════════════════════════════════════

/** Shape que o Header server passa ao HeaderClient */
export type HeaderProfile = {
  avatar_url: string | null
  role: UserRole
  full_name: string | null
}

/** Shape retornado por .from('profiles').select() */
export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  managed_categories: string[] | null
  managed_creators: string[] | null
  created_at: string
}

// ═══════════════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════════════

export type AuthError = {
  message: string
  status?: number
}

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

// ═══════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════

/** Helper para acessar joins do Supabase com segurança */
export type SupabaseJoin<T> = T | T[] | null

/** Extrai nome de categoria de um join */
export function getCategoryName(
  category:
    | Category
    | { name: string }
    | { name: string }[]
    | null
    | undefined
): string {
  if (!category) return 'Sem categoria'
  if (Array.isArray(category)) return category[0]?.name ?? 'Sem categoria'
  return category.name ?? 'Sem categoria'
}

/** Extrai nome do criador de um join */
export function getCreatorName(
  creator: Content['creator']
): string {
  if (!creator) return 'Desconhecido'
  if (Array.isArray(creator)) return creator[0]?.full_name ?? 'Desconhecido'
  return creator.full_name ?? 'Desconhecido'
}