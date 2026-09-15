'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Notification } from '@/types'

const DS = DESIGN_SYSTEM

interface NotificacoesClientProps {
  userId: string
}

export default function NotificacoesClient({ userId }: NotificacoesClientProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  async function loadNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      console.error('Erro ao carregar notificacoes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [userId])

  useEffect(() => {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function markAsRead(notificationId: string) {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
    }
  }

  async function markAllAsRead() {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error('Erro ao marcar tudo como lido:', err)
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      // ✅ IMPORTANTE: Deletar do banco PRIMEIRO
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) {
        console.error('Erro ao deletar:', error)
        return
      }

      // ✅ Depois remover do estado local
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (err) {
      console.error('Erro:', err)
    }
  }


  function getNotificationIcon(type: string): string {
    switch (type) {
      case 'content_approved':
        return '✅'
      case 'content_rejected':
        return '❌'
      case 'pending_content':
        return '⏳'
      default:
        return '🔔'
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.metadata?.content_id) {
      router.push(`/content/${notification.metadata.content_id}`)
    } else if (notification.type === 'pending_content') {
      router.push('/admin')
    }
  }

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <main style={{
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: DS.colors.bg.primary,
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: `2px solid ${DS.colors.primary.accent}`,
        }}>
          <div>
            <h1 style={{
              color: DS.colors.text.dark,
              margin: '0 0 5px 0',
              fontSize: '28px',
              fontWeight: '800',
            }}>
              🔔 Notificações
            </h1>
            <p style={{ color: DS.colors.text.secondary, margin: 0, fontSize: '14px' }}>
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
                color: DS.colors.text.dark,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: DS.transitions.base,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#E8C895')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = DS.colors.primary.accent)
              }
            >
              ✓ Marcar tudo como lido
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f ? DS.colors.primary.main : DS.colors.bg.secondary,
                color: filter === f ? 'white' : DS.colors.text.secondary,
                border: `1px solid ${filter === f ? DS.colors.primary.main : DS.colors.neutral.light}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: filter === f ? 'bold' : 'normal',
                fontSize: '13px',
                transition: DS.transitions.base,
              }}
              onMouseOver={(e) => {
                if (filter !== f) e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
              }}
              onMouseOut={(e) => {
                if (filter !== f) e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
              }}
            >
              {f === 'all' ? 'Todas' : 'Não Lidas'}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: DS.colors.text.secondary }}>Carregando notificações...</p>
          </div>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: DS.colors.bg.secondary,
            borderRadius: '8px',
            border: `1px solid ${DS.colors.neutral.light}`,
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>📭</p>
            <p style={{ color: DS.colors.text.secondary, margin: 0, fontSize: '14px' }}>
              {filter === 'unread'
                ? 'Nenhuma notificação não lida'
                : 'Nenhuma notificação'}
            </p>
          </div>
        )}

        {!loading && filteredNotifications.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: notification.read ? DS.colors.bg.secondary : DS.colors.primary.accent + '15',
                  border: `1px solid ${notification.read
                      ? DS.colors.neutral.light
                      : DS.colors.primary.accent
                    }`,
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: DS.transitions.base,
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = DS.colors.primary.accent + '25'
                  e.currentTarget.style.borderColor = DS.colors.primary.accent
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read
                    ? DS.colors.bg.secondary
                    : DS.colors.primary.accent + '15'
                  e.currentTarget.style.borderColor = notification.read
                    ? DS.colors.neutral.light
                    : DS.colors.primary.accent
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div style={{
                  fontSize: '24px',
                  minWidth: '40px',
                  textAlign: 'center',
                }}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: DS.colors.text.dark,
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}>
                    {notification.title}
                  </h3>
                  {notification.message && (
                    <p style={{
                      color: DS.colors.text.secondary,
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                    }}>
                      {notification.message}
                    </p>
                  )}
                  <p style={{ color: DS.colors.text.muted, margin: 0, fontSize: '12px' }}>
                    {new Date(notification.created_at).toLocaleDateString(
                      'pt-BR',
                      {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'flex-end',
                }}>
                  {!notification.read && (
                    <span style={{
                      backgroundColor: DS.colors.primary.accent,
                      color: DS.colors.text.dark,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}>
                      Nova
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: DS.colors.secondary.error,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: DS.transitions.base,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = DS.colors.secondary.error + '15'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    ✕ Deletar
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