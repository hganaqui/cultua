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
  managed_categories: string[] | null
  managed_creators: string[] | null
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
// TAGS / THEMES ✅ NOVO
// ═══════════════════════════════════════════════════════════════════

export type Tag = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  created_at: string
  text_color?: string | null
}

export type ContentTag = {
  id: string
  content_id: string
  tag_id: string
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════

export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type ContentType = 'video' | 'audio' | 'text'

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
  category?: Category | Category[] | null
  creator?: Pick<User, 'id' | 'full_name' | 'avatar_url'> | null
  tags?: Tag[] | null  // ✅ NOVO
}

/** Shape mínimo usado em /meus-uploads */
export type ContentWithStatus = {
  id: string
  title: string
  status: string
  creator_id: string | null
  created_at: string
  url_thumb: string | null
  category: Category | Category[] | null
  tags?: Tag[] | null  // ✅ NOVO
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
  scope_value: string
  granted_by: string | null
  created_at: string
}

export type AdminScopes = {
  categories: string[]
  creators: string[]
}

export type AdminWithScopes = {
  id: string
  full_name: string | null
  email: string
  role: UserRole
  created_at: string
  scopes: AdminScopes
}

export type CreatorOption = {
  id: string
  full_name: string | null
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE (retorno do Supabase em joins)
// ═══════════════════════════════════════════════════════════════════

export type HeaderProfile = {
  avatar_url: string | null
  role: UserRole
  full_name: string | null
}

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
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
  'Too many requests': 'Muitas tentativas. Aguarde alguns minutos.',
  'User already registered': 'Esse e-mail já está cadastrado.',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
  'Unable to validate email address': 'E-mail inválido.',
  'User not found': 'Nenhuma conta encontrada com esse e-mail.',
}

export function translateAuthError(message: string): string {
  return AUTH_ERROR_MAP[message] ?? 'Erro inesperado. Tente novamente.'
}

// ═══════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════

export type SupabaseJoin<T> = T | T[] | null

export function getCategoryName(
  category: Category | Category[] | null | undefined
): string {
  if (!category) return 'Sem categoria'
  if (Array.isArray(category)) return category[0]?.name ?? 'Sem categoria'
  return category.name ?? 'Sem categoria'
}

export function getCategory(
  category: Category | Category[] | null | undefined
): Category | null {
  if (!category) return null
  if (Array.isArray(category)) return category[0] ?? null
  return category
}

export function getCreatorName(
  creator: Content['creator']
): string {
  if (!creator) return 'Desconhecido'
  if (Array.isArray(creator)) return creator[0]?.full_name ?? 'Desconhecido'
  return creator.full_name ?? 'Desconhecido'
}

// ═══════════════════════════════════════════════════════════════════
// TAG HELPERS ✅ NOVO
// ═══════════════════════════════════════════════════════════════════

export function getContentTags(
  tags: Tag[] | null | undefined
): Tag[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  return []
}

export function formatTags(tags: Tag[] | null | undefined, maxDisplay: number = 3): {
  display: Tag[]
  remaining: number
} {
  const tagList = getContentTags(tags)
  return {
    display: tagList.slice(0, maxDisplay),
    remaining: Math.max(0, tagList.length - maxDisplay),
  }
}

export function getTagTextColor(tag: Tag | null | undefined): string {
  if (!tag) return '#FFFFFF'
  return tag.text_color || tag.color || '#FFFFFF'
}