'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types'

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
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (err) {
      console.error('Erro ao deletar notificacao:', err)
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
      backgroundColor: '#111111',
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #B8860B',
          }}
        >
          <div>
            <h1
              style={{
                color: '#FFFFFF',
                margin: '0 0 5px 0',
                fontSize: '28px',
                fontWeight: '800',
              }}
            >
              Notificacoes
            </h1>
            <p style={{ color: '#CCCCCC', margin: 0, fontSize: '14px' }}>
              {unreadCount > 0
                ? `${unreadCount} nao lida${unreadCount > 1 ? 's' : ''}`
                : 'Todas as notificacoes lidas'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '10px 16px',
                backgroundColor: '#B8860B',
                color: '#111111',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#D4AF37')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#B8860B')
              }
            >
              Marcar tudo como lido
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
                backgroundColor: filter === f ? '#B8860B' : '#1a1a1a',
                color: filter === f ? '#111111' : '#CCCCCC',
                border: `1px solid ${filter === f ? '#B8860B' : '#333333'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: filter === f ? 'bold' : 'normal',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (filter !== f) e.currentTarget.style.backgroundColor = '#2a2a2a'
              }}
              onMouseOut={(e) => {
                if (filter !== f) e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
            >
              {f === 'all' ? 'Todas' : 'Nao lidas'}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: '#CCCCCC' }}>Carregando notificacoes...</p>
          </div>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              border: '1px solid #333333',
            }}
          >
            <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>Box</p>
            <p style={{ color: '#CCCCCC', margin: 0, fontSize: '14px' }}>
              {filter === 'unread'
                ? 'Nenhuma notificacao nao lida'
                : 'Nenhuma notificacao'}
            </p>
          </div>
        )}

        {!loading && filteredNotifications.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: notification.read ? '#1a1a1a' : '#2a2a2a',
                  border: `1px solid ${
                    notification.read
                      ? '#333333'
                      : '#B8860B'
                  }`,
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2a2a2a'
                  e.currentTarget.style.borderColor = '#B8860B'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read
                    ? '#1a1a1a'
                    : '#2a2a2a'
                  e.currentTarget.style.borderColor = notification.read
                    ? '#333333'
                    : '#B8860B'
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div
                  style={{
                    fontSize: '24px',
                    minWidth: '40px',
                    textAlign: 'center',
                  }}
                >
                  {notification.type === 'content_approved' && 'Check'}
                  {notification.type === 'content_rejected' && 'X'}
                  {notification.type === 'pending_content' && 'Clock'}
                  {!['content_approved', 'content_rejected', 'pending_content'].includes(notification.type) && 'Bell'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      color: '#FFFFFF',
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {notification.title}
                  </h3>
                  {notification.message && (
                    <p
                      style={{
                        color: '#CCCCCC',
                        margin: '0 0 8px 0',
                        fontSize: '14px',
                      }}
                    >
                      {notification.message}
                    </p>
                  )}
                  <p style={{ color: '#666666', margin: 0, fontSize: '12px' }}>
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

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'flex-end',
                  }}
                >
                  {!notification.read && (
                    <span
                      style={{
                        backgroundColor: '#B8860B',
                        color: '#111111',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
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
                      color: '#EF4444',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#EF4444'
                      e.currentTarget.style.color = '#FFFFFF'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#EF4444'
                    }}
                  >
                    X Deletar
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