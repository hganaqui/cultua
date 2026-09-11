// src/lib/db.ts
import { supabase } from '@/lib/supabase'
import type { Content, Category } from '@/types'

// ── Conteúdos ────────────────────────────────────────────────

export async function getContents(options?: {
  categorySlug?: string
  featured?: boolean
  limit?: number
}) {
  let query = supabase
    .from('contents')
    .select(`
      *,
      category:categories(id, name, slug, color, icon),
      creator:profiles(id, full_name, avatar_url)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (options?.categorySlug) {
    query = query.eq('categories.slug', options.categorySlug)
  }
  if (options?.featured) {
    query = query.eq('is_featured', true)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  return { data, error }
}

export async function getContentById(id: string) {
  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      category:categories(id, name, slug, color, icon),
      creator:profiles(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  return { data, error }
}

export async function getContentsByCategory(slug: string) {
  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      category:categories!inner(id, name, slug, color, icon),
      creator:profiles(id, full_name, avatar_url)
    `)
    .eq('status', 'approved')
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getFeaturedContents(limit = 6) {
  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      category:categories(id, name, slug, color, icon),
      creator:profiles(id, full_name, avatar_url)
    `)
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

export async function incrementViewCount(contentId: string) {
  await supabase.rpc('increment_view_count', { content_id: contentId })
}

// ── Categorias ───────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return { data, error }
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data, error }
}

// ── Histórico ────────────────────────────────────────────────

export async function saveWatchHistory(userId: string, contentId: string, progressSec: number, completed: boolean) {
  const { error } = await supabase
    .from('watch_history')
    .upsert({
      user_id:      userId,
      content_id:   contentId,
      progress_sec: progressSec,
      completed,
      watched_at:   new Date().toISOString(),
    }, { onConflict: 'user_id,content_id' })

  return { error }
}

export async function getWatchHistory(userId: string) {
  const { data, error } = await supabase
    .from('watch_history')
    .select(`
      *,
      content:contents(
        id, title, duration, url_thumb,
        category:categories(name, slug, color)
      )
    `)
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(20)

  return { data, error }
}