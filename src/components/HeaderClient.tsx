'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { createBrowserClient } from '@supabase/ssr'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

const DS = DESIGN_SYSTEM
const ERROR_COLOR = '#C84C3C'

const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface HeaderClientProps {
  user: SupabaseUser | null
  profile?: {
    avatar_url: string | null
    role: UserRole
    full_name: string | null
  } | null
}

export default function HeaderClient({ user, profile }: HeaderClientProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [imgError, setImgError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<ReturnType<typeof supabaseBrowser.channel> | null>(null)

  const displayName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Usuário'

  const avatarUrl = profile?.avatar_url ?? null
  const role = profile?.role ?? 'user'
  const isAdmin = role === 'admin' || role === 'superadmin'
  const isSuperadmin = role === 'superadmin'

  // ✅ fetchUnread com debug
  const fetchUnread = useCallback(async () => {
    if (!user) return
    try {
      const { count, error } = await supabaseBrowser
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) {
        console.error('[Header] Erro:', error)
        return
      }
      setUnreadCount(count ?? 0)
    } catch (err) {
      console.error('[Header] Exceção:', err)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    // Fetch inicial
    fetchUnread()

    // ✅ Realtime com INSERT + UPDATE + DELETE
    if (channelRef.current) {
      supabaseBrowser.removeChannel(channelRef.current)
      channelRef.current = null
    }

    const channel = supabaseBrowser
      .channel(`header-notifs-${user.id}-${Date.now()}`) // ✅ nome único evita conflito
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchUnread())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchUnread())
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'notifications',
        // ✅ DELETE não suporta filter no Supabase — sem filter mesmo
      }, () => fetchUnread())
      .subscribe((status) => {
        console.log('[Header] Canal status:', status)
      })

    channelRef.current = channel

    // ✅ FALLBACK: polling a cada 30s caso realtime falhe
    const interval = setInterval(fetchUnread, 30_000)

    return () => {
      if (channelRef.current) {
        supabaseBrowser.removeChannel(channelRef.current)
        channelRef.current = null
      }
      clearInterval(interval)
    }
  }, [user?.id, fetchUnread])

  // ── Fecha dropdown ao clicar fora ───────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Fecha menu mobile ao redimensionar ──────────────────────────
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  async function handleSignOut() {
    if (channelRef.current) {
      supabaseBrowser.removeChannel(channelRef.current)
      channelRef.current = null
    }
    await signOut()
    router.push('/')
    router.refresh()
  }

  // ── Avatar ───────────────────────────────────────────────────────
  function Avatar({ size = 28 }: { size?: number }) {
    if (avatarUrl && !imgError) {
      return (
        <img
          src={`${avatarUrl}?t=${Date.now()}`}
          alt={displayName}
          onError={() => setImgError(true)}
          style={{
            width: size, height: size,
            borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
          }}
        />
      )
    }
    return (
      <div style={{
        width: size, height: size,
        backgroundColor: DS.colors.primary.accent,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.42,
        fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.primary.main,
        flexShrink: 0,
        fontFamily: DS.typography.fontFamily.heading,
      }}>
        {displayName[0].toUpperCase()}
      </div>
    )
  }

  const navLinks = [
    { href: '/categoria/louvor', label: 'Louvor' },
    { href: '/categoria/pregacao', label: 'Pregação' },
    { href: '/categoria/crescimento', label: 'Crescimento' },
    { href: '/categoria/testemunhos', label: 'Testemunhos' },
    { href: '/categoria/familia', label: 'Família' },
    { href: '/categoria/estudos', label: 'Estudos' },
  ]

  const userMenuItems = [
    { href: '/perfil', label: '👤 Meu Perfil' },
    { href: '/historico', label: '📺 Histórico' },
    { href: '/playlist', label: '🎵 Minhas Playlists' },
    { href: '/meus-uploads', label: '📤 Meus Uploads' },
    { href: '/configuracoes', label: '⚙️ Configurações' },
  ]

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hdr-desktop    { display: none !important; }
          .hdr-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hdr-mobile-btn { display: none !important; }
        }
        .hdr-navlink {
          color: ${DS.colors.text.secondary};
          font-family: ${DS.typography.fontFamily.body};
          font-size: 14px;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: ${DS.borderRadius.md};
          transition: ${DS.transitions.fast};
          font-weight: ${DS.typography.fontWeight.medium};
        }
        .hdr-navlink:hover {
          color: ${DS.colors.primary.main};
          background-color: rgba(15,61,46,0.06);
        }
        .hdr-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          background-color: transparent;
          border: 1.5px solid ${DS.colors.neutral.medium};
          border-radius: ${DS.borderRadius.full};
          padding: 4px 12px 4px 4px;
          cursor: pointer; font-size: 14px;
          font-family: ${DS.typography.fontFamily.body};
          font-weight: ${DS.typography.fontWeight.medium};
          color: ${DS.colors.text.primary};
          transition: ${DS.transitions.fast};
          position: relative;
        }
        .hdr-avatar-btn:hover {
          border-color: ${DS.colors.primary.main};
          background-color: rgba(15,61,46,0.04);
        }
        .hdr-notif-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: ${DS.borderRadius.full};
          background-color: transparent;
          border: 1.5px solid ${DS.colors.neutral.medium};
          cursor: pointer;
          transition: ${DS.transitions.fast};
          position: relative;
          text-decoration: none;
        }
        .hdr-notif-btn:hover {
          border-color: ${DS.colors.primary.main};
          background-color: rgba(15,61,46,0.04);
        }
        .hdr-dropdown-link {
          display: block;
          color: ${DS.colors.text.secondary};
          text-decoration: none; font-size: 13px;
          font-family: ${DS.typography.fontFamily.body};
          padding: 8px 12px;
          border-radius: ${DS.borderRadius.md};
          transition: ${DS.transitions.fast};
        }
        .hdr-dropdown-link:hover {
          background-color: rgba(15,61,46,0.06);
          color: ${DS.colors.primary.main};
        }
        .hdr-dropdown-link--highlight:hover {
          background-color: rgba(15,61,46,0.08);
          color: ${DS.colors.primary.main};
        }
        .hdr-signout-btn {
          display: block; width: 100%; text-align: left;
          background-color: transparent; border: none;
          color: ${ERROR_COLOR};
          font-size: 13px; font-family: ${DS.typography.fontFamily.body};
          padding: 8px 12px; border-radius: ${DS.borderRadius.md};
          cursor: pointer; transition: ${DS.transitions.fast};
        }
        .hdr-signout-btn:hover { background-color: rgba(200,76,60,0.08); }
        .hdr-mobile-link {
          display: block;
          color: ${DS.colors.text.secondary};
          text-decoration: none; font-size: 16px;
          font-family: ${DS.typography.fontFamily.body};
          padding: 14px 0;
          border-bottom: 1px solid ${DS.colors.neutral.light};
          transition: ${DS.transitions.fast};
        }
        .hdr-mobile-link:hover { color: ${DS.colors.primary.main}; }
      `}</style>

      {/* ── Desktop Nav ── */}
      <div className="hdr-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            {/* ✅ Ícone de notificação SEMPRE visível */}
            <Link href="/notificacoes" className="hdr-notif-btn">
              <span style={{ fontSize: '18px' }}>🔔</span>

              {/* ✅ Badge só aparece se tiver notificações */}
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: ERROR_COLOR,
                  color: '#FFF',
                  fontSize: '10px',
                  fontWeight: DS.typography.fontWeight.bold,
                  borderRadius: DS.borderRadius.full,
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  zIndex: 10,
                  border: `2px solid ${DS.colors.bg.primary}`,
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Avatar com dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                className="hdr-avatar-btn"
                onClick={() => setUserMenuOpen(v => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <Avatar size={28} />
                <span>{displayName}</span>
                <span style={{ fontSize: '10px', color: DS.colors.text.muted, marginLeft: '2px' }}>▾</span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  backgroundColor: DS.colors.bg.secondary,
                  border: `1px solid ${DS.colors.neutral.light}`,
                  borderRadius: DS.borderRadius.xl, padding: '8px',
                  minWidth: '210px', boxShadow: DS.shadows['2xl'], zIndex: 200,
                }}>
                  {/* Cabeçalho */}
                  <div style={{ padding: '8px 12px 12px', borderBottom: `1px solid ${DS.colors.neutral.light}`, marginBottom: '4px' }}>
                    <div style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: '13px', fontWeight: DS.typography.fontWeight.bold, color: DS.colors.text.primary }}>
                      {displayName}
                    </div>
                    <div style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '11px', color: DS.colors.text.secondary, marginTop: '2px' }}>
                      {user.email}
                    </div>
                    {isAdmin && (
                      <span style={{
                        display: 'inline-block', marginTop: '8px', fontSize: '10px',
                        fontWeight: DS.typography.fontWeight.bold,
                        fontFamily: DS.typography.fontFamily.body,
                        backgroundColor: isSuperadmin ? 'rgba(168,85,247,0.12)' : 'rgba(15,61,46,0.10)',
                        color: isSuperadmin ? '#A855F7' : DS.colors.primary.main,
                        border: `1px solid ${isSuperadmin ? 'rgba(168,85,247,0.3)' : 'rgba(15,61,46,0.2)'}`,
                        borderRadius: DS.borderRadius.full, padding: '2px 10px', letterSpacing: '0.4px',
                      }}>
                        {isSuperadmin ? '⚡ SUPERADMIN' : '⭐ ADMIN'}
                      </span>
                    )}
                  </div>

                  {/* Links usuário */}
                  {userMenuItems.map(item => (
                    <a key={item.href} href={item.href} className="hdr-dropdown-link" onClick={() => setUserMenuOpen(false)}>
                      {item.label}
                    </a>
                  ))}

                  {/* Links admin */}
                  {isAdmin && (
                    <>
                      <div style={{ height: '1px', backgroundColor: DS.colors.neutral.light, margin: '6px 0' }} />
                      <a href="/admin" className="hdr-dropdown-link hdr-dropdown-link--highlight"
                        style={{ color: DS.colors.primary.main, fontWeight: DS.typography.fontWeight.semibold }}
                        onClick={() => setUserMenuOpen(false)}>
                        🛡️ Painel de Curadoria
                      </a>
                      <a href="/admin/tags" className="hdr-dropdown-link hdr-dropdown-link--highlight"
                        style={{ color: DS.colors.primary.main, fontWeight: DS.typography.fontWeight.semibold }}
                        onClick={() => setUserMenuOpen(false)}>
                        🏷️ Gerenciar Temas
                      </a>
                      {isSuperadmin && (
                        <a href="/admin/usuarios" className="hdr-dropdown-link"
                          style={{ color: '#A855F7', fontWeight: DS.typography.fontWeight.semibold }}
                          onClick={() => setUserMenuOpen(false)}>
                          ⚡ Gerenciar Usuários
                        </a>
                      )}
                    </>
                  )}

                  <div style={{ height: '1px', backgroundColor: DS.colors.neutral.light, margin: '6px 0' }} />
                  <button className="hdr-signout-btn" onClick={handleSignOut}>
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/auth/login"
              style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: DS.borderRadius.md, transition: DS.transitions.fast }}
              onMouseEnter={e => (e.currentTarget.style.color = DS.colors.primary.main)}
              onMouseLeave={e => (e.currentTarget.style.color = DS.colors.text.secondary)}
            >
              Entrar
            </Link>
            <Link href="/auth/signup"
              style={{ fontFamily: DS.typography.fontFamily.body, backgroundColor: DS.colors.primary.main, color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold, padding: '9px 20px', borderRadius: DS.borderRadius.lg, boxShadow: '0 2px 8px rgba(15,61,46,0.2)', transition: DS.transitions.fast }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
            >
              Começar
            </Link>
          </>
        )}
      </div>

      {/* ── Hamburger mobile ── */}
      <button
        className="hdr-mobile-btn"
        onClick={() => setMenuOpen(v => !v)}
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
        style={{
          backgroundColor: 'transparent', border: 'none',
          color: DS.colors.primary.main, fontSize: '22px',
          cursor: 'pointer', padding: '6px',
          display: 'none', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* ── Menu mobile ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0,
          backgroundColor: DS.colors.bg.secondary,
          borderTop: `1px solid ${DS.colors.neutral.light}`,
          padding: '16px', zIndex: 99,
          maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
          boxShadow: DS.shadows.lg,
        }}>
          {[{ href: '/', label: '🏠 Início' }, ...navLinks].map(item => (
            <Link key={item.href} href={item.href} className="hdr-mobile-link" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: '16px' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: `1px solid ${DS.colors.neutral.light}`, marginBottom: '8px' }}>
                  <Avatar size={40} />
                  <div>
                    <div style={{ fontFamily: DS.typography.fontFamily.heading, fontSize: '15px', fontWeight: DS.typography.fontWeight.bold, color: DS.colors.text.primary }}>
                      {displayName}
                    </div>
                    <div style={{ fontFamily: DS.typography.fontFamily.body, fontSize: '12px', color: DS.colors.text.secondary }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                {[
                  ...userMenuItems,
                  { href: '/notificacoes', label: '🔔 Notificações' },
                  ...(isAdmin ? [{ href: '/admin', label: '🛡️ Painel de Curadoria' }] : []),
                  ...(isSuperadmin ? [{ href: '/admin/usuarios', label: '⚡ Gerenciar Usuários' }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href} className="hdr-mobile-link" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={handleSignOut}
                  style={{
                    marginTop: '12px', width: '100%',
                    backgroundColor: `${ERROR_COLOR}10`,
                    color: ERROR_COLOR,
                    border: `1px solid ${ERROR_COLOR}30`,
                    borderRadius: DS.borderRadius.lg, padding: '13px',
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
                    cursor: 'pointer', transition: DS.transitions.fast,
                  }}
                >
                  🚪 Sair da conta
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, textDecoration: 'none', padding: '13px', border: `1.5px solid ${DS.colors.neutral.medium}`, borderRadius: DS.borderRadius.lg, fontSize: '15px', fontWeight: DS.typography.fontWeight.medium }}>
                  Entrar
                </Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', fontFamily: DS.typography.fontFamily.body, backgroundColor: DS.colors.primary.main, color: '#FFFFFF', textDecoration: 'none', padding: '13px', borderRadius: DS.borderRadius.lg, fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold }}>
                  Começar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}