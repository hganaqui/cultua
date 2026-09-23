'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Notification } from '@/types'

const DS = DESIGN_SYSTEM
const ERROR_COLOR = '#C84C3C'

interface Props { userId: string }

export default function NotificacoesClient({ userId }: Props) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  async function loadNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      console.log('[Notificacoes] Carregadas:', data?.length, 'notificações')
      setNotifications(data ?? [])
    } catch (err) {
      console.error('[Notificacoes] load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('[Notificacoes] useEffect loadNotifications')
    loadNotifications()
  }, [userId])

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`notificacoes-page-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        console.log('[Notificacoes] INSERT via realtime:', payload.new)
        setNotifications(prev => [payload.new as Notification, ...prev])
      })
      // ✅ ADICIONAR: sincroniza quando outra aba/dispositivo marca como lido
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        console.log('[Notificacoes] UPDATE via realtime:', payload.new)
        setNotifications(prev =>
          prev.map(n => n.id === (payload.new as Notification).id
            ? { ...n, ...(payload.new as Notification) }
            : n
          )
        )
      })
      // ✅ ADICIONAR: sincroniza quando deleta
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'notifications',
      }, payload => {
        console.log('[Notificacoes] DELETE via realtime:', payload.old)
        setNotifications(prev =>
          prev.filter(n => n.id !== (payload.old as Notification).id)
        )
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  // NotificacoesClient.tsx — substituir markAsRead e markAllAsRead

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      // ✅ Atualiza estado local imediatamente (UI responsiva)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      // ✅ Re-fetch completo para garantir sync
      await loadNotifications()
    } catch (err) {
      console.error('[Notificacoes] markAsRead error:', err)
    }
  }

  async function markAllAsRead() {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      // ✅ Atualiza estado local imediatamente
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      // ✅ Re-fetch completo para garantir sync
      await loadNotifications()
    } catch (err) {
      console.error('[Notificacoes] markAllAsRead error:', err)
    }
  }

  // ✅ CORRIGIDO: Verificação detalhada de erro
  async function deleteNotification(id: string) {
    try {
      console.log('[Notificacoes] Iniciando delete para:', id)
      setDeleting(id)

      // ✅ Verificar se a notificação existe
      const { data: notif, error: checkError } = await supabase
        .from('notifications')
        .select('id')
        .eq('id', id)
        .single()

      if (checkError || !notif) {
        console.error('[Notificacoes] Notificação não encontrada:', checkError)
        alert('Notificação não encontrada')
        setNotifications(prev => prev.filter(n => n.id !== id))
        setDeleting(null)
        return
      }

      console.log('[Notificacoes] Notificação encontrada, deletando...')

      // ✅ Deletar com verificação
      const { data, error, count } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .select()

      console.log('[Notificacoes] Delete response:', { data, error, count })

      if (error) {
        console.error('[Notificacoes] Delete error:', error)
        alert(`Erro ao deletar: ${error.message}`)
        setDeleting(null)
        return
      }

      console.log('[Notificacoes] Deletada com sucesso, removendo do state')
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id)
        console.log('[Notificacoes] State atualizado. Restantes:', updated.length)
        return updated
      })
      setDeleting(null)

    } catch (err) {
      console.error('[Notificacoes] Delete exception:', err)
      alert('Erro ao deletar notificação')
      setDeleting(null)
    }
  }

  function getIcon(type: string) {
    const map: Record<string, string> = {
      content_approved: '✅',
      content_rejected: '❌',
      pending_content: '⏳',
    }
    return map[type] ?? '🔔'
  }

  function handleClick(n: Notification) {
    if (!n.read) markAsRead(n.id)
    if (n.metadata?.content_id) router.push(`/content/${n.metadata.content_id}`)
    else if (n.type === 'pending_content') router.push('/admin')
  }

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: DS.colors.bg.primary,
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: `2px solid ${DS.colors.primary.accent}`,
        }}>
          <div>
            <h1 style={{
              fontFamily: DS.typography.fontFamily.heading,
              color: DS.colors.text.primary,
              margin: '0 0 5px 0',
              fontSize: '28px', fontWeight: DS.typography.fontWeight.bold,
            }}>
              🔔 Notificações
            </h1>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, margin: 0, fontSize: '14px' }}>
              {unreadCount > 0
                ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
                : 'Todas as notificações lidas'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '10px 16px',
                backgroundColor: DS.colors.primary.accent,
                color: DS.colors.primary.main,
                border: 'none', borderRadius: DS.borderRadius.lg,
                fontFamily: DS.typography.fontFamily.body,
                cursor: 'pointer', fontWeight: DS.typography.fontWeight.semibold,
                fontSize: '13px', transition: DS.transitions.fast,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.accentLight)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.accent)}
            >
              ✓ Marcar tudo como lido
            </button>
          )}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f ? DS.colors.primary.main : DS.colors.bg.secondary,
                color: filter === f ? '#FFFFFF' : DS.colors.text.secondary,
                border: `1.5px solid ${filter === f ? DS.colors.primary.main : DS.colors.neutral.medium}`,
                borderRadius: DS.borderRadius.md,
                fontFamily: DS.typography.fontFamily.body,
                cursor: 'pointer',
                fontWeight: filter === f ? DS.typography.fontWeight.semibold : DS.typography.fontWeight.normal,
                fontSize: '13px', transition: DS.transitions.fast,
              }}
            >
              {f === 'all' ? 'Todas' : 'Não Lidas'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary }}>
              Carregando notificações...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            backgroundColor: DS.colors.bg.secondary,
            borderRadius: DS.borderRadius.xl,
            border: `1px solid ${DS.colors.neutral.light}`,
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>📭</p>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, margin: 0, fontSize: '14px' }}>
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </p>
          </div>
        )}

        {/* Lista */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {filtered.map(n => (
              <div
                key={n.id}
                style={{
                  backgroundColor: n.read ? DS.colors.bg.secondary : `${DS.colors.primary.accent}15`,
                  border: `1px solid ${n.read ? DS.colors.neutral.light : DS.colors.primary.accent}`,
                  borderRadius: DS.borderRadius.lg, padding: '16px',
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  transition: DS.transitions.fast, cursor: 'pointer',
                  opacity: deleting === n.id ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  if (deleting !== n.id) {
                    el.style.backgroundColor = `${DS.colors.primary.accent}22`
                    el.style.borderColor = DS.colors.primary.accent
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  if (deleting !== n.id) {
                    el.style.backgroundColor = n.read ? DS.colors.bg.secondary : `${DS.colors.primary.accent}15`
                    el.style.borderColor = n.read ? DS.colors.neutral.light : DS.colors.primary.accent
                  }
                }}
                onClick={() => handleClick(n)}
              >
                {/* Ícone */}
                <div style={{ fontSize: '24px', minWidth: '40px', textAlign: 'center' }}>
                  {getIcon(n.type)}
                </div>

                {/* Texto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontFamily: DS.typography.fontFamily.heading,
                    color: DS.colors.text.primary,
                    margin: '0 0 4px 0', fontSize: '16px',
                    fontWeight: DS.typography.fontWeight.semibold,
                  }}>
                    {n.title}
                  </h3>
                  {n.message && (
                    <p style={{
                      fontFamily: DS.typography.fontFamily.body,
                      color: DS.colors.text.secondary,
                      margin: '0 0 8px 0', fontSize: '14px',
                    }}>
                      {n.message}
                    </p>
                  )}
                  <p style={{
                    fontFamily: DS.typography.fontFamily.body,
                    color: DS.colors.text.muted, margin: 0, fontSize: '12px',
                  }}>
                    {new Date(n.created_at).toLocaleDateString('pt-BR', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', alignItems: 'flex-end' }}>
                  {!n.read && (
                    <span style={{
                      fontFamily: DS.typography.fontFamily.body,
                      backgroundColor: DS.colors.primary.accent,
                      color: DS.colors.primary.main,
                      padding: '4px 10px', borderRadius: DS.borderRadius.sm,
                      fontSize: '11px', fontWeight: DS.typography.fontWeight.bold,
                    }}>
                      Nova
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotification(n.id) }}
                    disabled={deleting === n.id}
                    style={{
                      backgroundColor: 'transparent', color: ERROR_COLOR,
                      border: 'none', cursor: deleting === n.id ? 'not-allowed' : 'pointer',
                      fontSize: '13px', fontFamily: DS.typography.fontFamily.body,
                      padding: '4px 8px', borderRadius: DS.borderRadius.sm,
                      transition: DS.transitions.fast,
                      opacity: deleting === n.id ? 0.6 : 1,
                    }}
                    onMouseEnter={e => {
                      if (deleting !== n.id) {
                        e.currentTarget.style.backgroundColor = `${ERROR_COLOR}15`
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {deleting === n.id ? '⏳ Deletando...' : '✕ Deletar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}