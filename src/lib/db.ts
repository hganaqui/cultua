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

// ── Notificações ─────────────────────────────────────────────

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getUnreadNotificationsCount(userId: string) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  return { count: count ?? 0, error }
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  return { error }
}

export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  return { error }
}

export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  return { error }
}

export async function notifyAdminsOfPendingContent(contentId: string, contentTitle: string) {
  try {
    // 1. Buscar todos os admins
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['admin', 'superadmin'])

    if (!admins || admins.length === 0) return

    // 2. Criar notificação para cada admin
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: 'pending_content',
      title: '📋 Novo conteúdo para aprovar',
      message: `"${contentTitle}" está aguardando revisão.`,
      read: false,
      metadata: { content_id: contentId },
    }))

    const { error } = await supabase
      .from('notifications')
      .insert(notifications)

    if (error) throw error
  } catch (err) {
    console.error('Erro ao notificar admins:', err)
  }
}

export async function notifyAdminsOfApprovedContent(userId: string, contentTitle: string, contentId: string) {
  try {
    // Notificar o criador que seu conteúdo foi aprovado
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'content_approved',
        title: '✅ Conteúdo aprovado!',
        message: `"${contentTitle}" foi aprovado e está publicado.`,
        read: false,
        metadata: { content_id: contentId },
      })

    if (error) throw error
  } catch (err) {
    console.error('Erro ao notificar aprovação:', err)
  }
}

export async function notifyAdminsOfRejectedContent(userId: string, contentTitle: string, contentId: string) {
  try {
    // Notificar o criador que seu conteúdo foi rejeitado
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'content_rejected',
        title: '❌ Conteúdo rejeitado',
        message: `"${contentTitle}" foi rejeitado. Revise e tente novamente.`,
        read: false,
        metadata: { content_id: contentId },
      })

    if (error) throw error
  } catch (err) {
    console.error('Erro ao notificar rejeição:', err)
  }
}