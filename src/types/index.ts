// ✅ src/types/index.ts (CORRIGIDO)

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
// TAGS / THEMES
// ═══════════════════════════════════════════════════════════════════

export type Tag = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  text_color?: string | null
  created_at: string
}

export type ContentTag = {
  id: string
  content_id: string
  tag_id: string
  tag?: Tag // ✅ ADICIONADO: referência completa à tag
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════

export type ContentStatus = 'pending' | 'published' | 'rejected' // ✅ CORRIGIDO: 'approved' → 'published'
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
  published_at?: string | null
  category?: Category | null // ✅ SIMPLIFICADO: removido Category[]
  creator?: Pick<User, 'id' | 'full_name' | 'avatar_url'> | null
  content_tags?: ContentTag[] | null // ✅ CORRIGIDO: nome da relação correto
}

/** Shape mínimo usado em /meus-uploads */
export type ContentWithStatus = {
  id: string
  title: string
  status: ContentStatus
  creator_id: string | null
  created_at: string
  url_thumb: string | null
  category: Category | null // ✅ SIMPLIFICADO: removido Category[]
  content_tags?: ContentTag[] | null // ✅ CORRIGIDO: nome da relação correto
}

// ═══════════════════════════════════════════════════════════════════
// WATCH HISTORY
// ═══════════════════════════════════════════════════════════════════

export type WatchHistory = {
  id: string
  user_id: string
  content_id: string
  progress_seconds: number // ✅ CORRIGIDO: progress_sec → progress_seconds
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
  name: string // ✅ CORRIGIDO: title → name
  description: string | null
  is_public: boolean // ✅ CORRIGIDO: public → is_public
  created_at: string
  updated_at: string
}

export type PlaylistItem = {
  id: string // ✅ ADICIONADO: id (chave primária)
  playlist_id: string
  content_id: string
  order: number // ✅ CORRIGIDO: position → order
  created_at: string
  content?: Content
}

// ═══════════════════════════════════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════════════════════════════════

export type Favorite = {
  id: string
  user_id: string
  content_id: string
  created_at: string
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
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function getCategoryName(
  category: Category | null | undefined
): string {
  if (!category) return 'Sem categoria'
  return category.name ?? 'Sem categoria'
}

export function getCategory(
  category: Category | null | undefined
): Category | null {
  if (!category) return null
  return category
}

export function getCreatorName(
  creator: Content['creator']
): string {
  if (!creator) return 'Desconhecido'
  return creator.full_name ?? 'Desconhecido'
}

// ✅ TAG HELPERS

export function getContentTags(
  contentTags: ContentTag[] | null | undefined
): Tag[] {
  if (!contentTags) return []
  return contentTags
    .map(ct => ct.tag)
    .filter((tag): tag is Tag => tag !== undefined && tag !== null)
}

export function formatTags(
  contentTags: ContentTag[] | null | undefined,
  maxDisplay: number = 3
): {
  display: Tag[]
  remaining: number
} {
  const tagList = getContentTags(contentTags)
  return {
    display: tagList.slice(0, maxDisplay),
    remaining: Math.max(0, tagList.length - maxDisplay),
  }
}

export function getTagTextColor(tag: Tag | null | undefined): string {
  if (!tag) return '#1F1F1F' // Grafite padrão
  return tag.text_color || '#1F1F1F'
}