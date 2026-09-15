'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import BuscaGlobalClient from './BuscaGlobalClient'
import BuscaGlobalClientMobile from './BuscaGlobalClientMobile'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

const DS = DESIGN_SYSTEM

interface ProfileState {
  role: UserRole
  avatar_url: string | null
  full_name: string | null
}

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/categoria/louvor', label: '🎵 Louvor' },
  { href: '/categoria/pregacao', label: '📖 Pregação' },
  { href: '/categoria/crescimento', label: '🌱 Crescimento' },
  { href: '/categoria/testemunhos', label: '🙏 Testemunhos' },
]

const USER_LINKS = [
  { href: '/perfil', label: '👤 Meu Perfil' },
  { href: '/historico', label: '📺 Histórico' },
  { href: '/playlist', label: '🎵 Minhas Playlists' },
  { href: '/meus-uploads', label: '📤 Meus Uploads' },
  { href: '/configuracoes', label: '⚙️ Configurações' },
]

export default function Header() {
  const router = useRouter()
  const dropRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileState | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState(0)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('role, avatar_url, full_name')
      .eq('id', userId)
      .single()
    setProfile(data ?? { role: 'user', avatar_url: null, full_name: null })
  }

  async function fetchUnread(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (!error) {
      setUnread(count ?? 0)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      setLoading(false)
      if (u) {
        await fetchProfile(u.id)
        await fetchUnread(u.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        setLoading(false)
        if (u) {
          await fetchProfile(u.id)
          await fetchUnread(u.id)
        } else {
          setProfile(null)
          setUnread(0)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`header-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchUnread(user.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const role = profile?.role ?? 'user'
  const isAdmin = role === 'admin' || role === 'superadmin'
  const isSuperadmin = role === 'superadmin'

  const displayName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Usuário'

  const ROLE_BADGE = {
    admin: { label: '⭐ Admin', color: DS.colors.primary.accent, bg: DS.colors.primary.accent + '15', border: DS.colors.primary.accent + '30' },
    superadmin: { label: '⚡ Superadmin', color: '#A855F7', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)' },
  }
  const badge = isAdmin ? ROLE_BADGE[role as 'admin' | 'superadmin'] : null

  async function handleSignOut() {
    await signOut()
    setUserMenu(false)
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const Avatar = ({ size = 28 }: { size?: number }) => {
    const avatarUrl = profile?.avatar_url
    return avatarUrl ? (
      <img
        src={avatarUrl + `?t=${Date.now()}`}
        alt={displayName}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    ) : (
      <div style={{
        width: size,
        height: size,
        backgroundColor: DS.colors.primary.accent,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.46,
        fontWeight: DS.typography.fontWeight.extrabold,
        color: 'white',
        flexShrink: 0,
      }}>
        {displayName[0].toUpperCase()}
      </div>
    )
  }

  return (
    <header style={{
      backgroundColor: DS.colors.primary.main,
      borderBottom: `2px solid ${DS.colors.primary.accent}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-cultua.jpg"
            alt="CULTUA"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: DS.borderRadius.md,
              objectFit: 'cover',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: DS.typography.fontWeight.extrabold,
              color: DS.colors.primary.accent,
              letterSpacing: '2px',
            }}
          >
            CULTUA
          </span>
        </Link>

        {/* ── Nav desktop ──────────────────────────────────────────────── */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '6px 10px',
                borderRadius: DS.borderRadius.md,
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item.label}
            </Link>
          ))}

          <BuscaGlobalClient />
        </nav>

        {/* ── Auth desktop ─────────────────────────────────────────────── */}
        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {!loading && user && (
            <Link
              href="/notificacoes"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative',
                backgroundColor: unread > 0 ? 'rgba(200, 76, 60, 0.2)' : 'transparent',
                border: `1.5px solid ${unread > 0 ? '#C84C3C' : 'rgba(255,255,255,0.3)'}`,
                borderRadius: DS.borderRadius.md,
                padding: '8px 12px',
                textDecoration: 'none',
                color: unread > 0 ? '#FFB3B0' : 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                fontWeight: unread > 0 ? '600' : '400',
                transition: DS.transitions.base,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = DS.colors.primary.accent
                e.currentTarget.style.color = DS.colors.primary.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = unread > 0 ? '#C84C3C' : 'rgba(255,255,255,0.3)'
                e.currentTarget.style.color = unread > 0 ? '#FFB3B0' : 'rgba(255,255,255,0.7)'
              }}
            >
              🔔
              {unread > 0 && (
                <span
                  style={{
                    backgroundColor: '#C84C3C',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: DS.typography.fontWeight.extrabold,
                    borderRadius: DS.borderRadius.full,
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          )}

          {loading ? (
            <div
              style={{
                width: '120px',
                height: '36px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: DS.borderRadius.full,
                opacity: 0.5,
              }}
            />
          ) : user ? (
            <div
              ref={dropRef}
              style={{
                position: 'relative',
              }}
            >
              <button
                onClick={() => setUserMenu(!userMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: DS.colors.primary.accent,
                  border: `1.5px solid ${DS.colors.primary.accent}`,
                  borderRadius: DS.borderRadius.full,
                  padding: '5px 12px 5px 5px',
                  cursor: 'pointer',
                  color: DS.colors.text.dark,
                  fontSize: '14px',
                  position: 'relative',
                  transition: DS.transitions.base,
                  fontWeight: '600',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#E8C895')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = DS.colors.primary.accent)
                }
              >
                <Avatar size={28} />
                {displayName}
                <span style={{ fontSize: '10px', color: DS.colors.text.dark }}>▼</span>
              </button>

              {userMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    backgroundColor: DS.colors.bg.secondary,
                    border: `1px solid ${DS.colors.neutral.light}`,
                    borderRadius: DS.borderRadius.xl,
                    padding: '8px',
                    minWidth: '200px',
                    boxShadow: DS.shadows['2xl'],
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px 12px',
                      borderBottom: `1px solid ${DS.colors.neutral.light}`,
                      marginBottom: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <Avatar size={36} />
                      <div>
                        <div
                          style={{
                            color: DS.colors.text.dark,
                            fontSize: '13px',
                            fontWeight: DS.typography.fontWeight.bold,
                          }}
                        >
                          {displayName}
                        </div>
                        <div
                          style={{
                            color: DS.colors.text.secondary,
                            fontSize: '11px',
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                    {badge && (
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '8px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          fontSize: '10px',
                          fontWeight: DS.typography.fontWeight.extrabold,
                          padding: '2px 10px',
                          borderRadius: DS.borderRadius.full,
                          border: `1px solid ${badge.border}`,
                          letterSpacing: '0.4px',
                        }}
                      >
                        {badge.label}
                      </span>
                    )}
                  </div>

                  {USER_LINKS.map((item) => (
                    <DropItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      onClick={() => setUserMenu(false)}
                    />
                  ))}

                  {isAdmin && (
                    <>
                      <div style={{ height: '1px', backgroundColor: DS.colors.neutral.light, margin: '6px 0' }} />
                      <DropItem
                        href="/admin"
                        label="🛡️ Painel de Curadoria"
                        onClick={() => setUserMenu(false)}
                        highlight
                      />
                      {isSuperadmin && (
                        <DropItem
                          href="/admin/usuarios"
                          label="⚡ Gerenciar Usuários"
                          onClick={() => setUserMenu(false)}
                          highlight
                          color="#A855F7"
                        />
                      )}
                    </>
                  )}

                  {unread > 0 && (
                    <DropItem
                      href="/notificacoes"
                      label={`🔔 Notificações (${unread})`}
                      onClick={() => setUserMenu(false)}
                    />
                  )}

                  <div style={{ height: '1px', backgroundColor: DS.colors.neutral.light, margin: '6px 0' }} />
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#C84C3C',
                      fontSize: '13px',
                      padding: '8px 12px',
                      borderRadius: DS.borderRadius.md,
                      cursor: 'pointer',
                      transition: DS.transitions.base,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#C84C3C' + '15')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '8px 12px',
                }}
              >
                Entrar
              </Link>
              <Link
                href="/auth/signup"
                style={{
                  backgroundColor: DS.colors.primary.accent,
                  color: DS.colors.text.dark,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: DS.typography.fontWeight.semibold,
                  padding: '8px 16px',
                  borderRadius: DS.borderRadius.md,
                }}
              >
                Começar
              </Link>
            </>
          )}
        </div>

        {/* ── Hamburger mobile ─────────────────────────────────────────── */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: DS.colors.primary.accent,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            display: 'none',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Menu mobile ──────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: DS.colors.bg.secondary,
            borderTop: `1px solid ${DS.colors.neutral.light}`,
            padding: '16px',
            zIndex: 99,
            maxHeight: 'calc(100vh - 60px)',
            overflowY: 'auto',
          }}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: DS.colors.text.secondary,
                textDecoration: 'none',
                fontSize: '16px',
                padding: '12px 0',
                borderBottom: `1px solid ${DS.colors.neutral.light}`,
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = DS.colors.primary.main)}
              onMouseLeave={(e) => (e.currentTarget.style.color = DS.colors.text.secondary)}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ borderBottom: `1px solid ${DS.colors.neutral.light}`, margin: '12px 0', paddingBottom: '12px' }}>
            <p style={{ color: DS.colors.text.secondary, fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600' }}>
              🔍 Buscar
            </p>
            <BuscaGlobalClientMobile />
          </div>

          <div style={{ marginTop: '16px' }}>
            {user ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: `1px solid ${DS.colors.neutral.light}`,
                    marginBottom: '12px',
                  }}
                >
                  <Avatar size={40} />
                  <div>
                    <div
                      style={{
                        color: DS.colors.text.dark,
                        fontSize: '14px',
                        fontWeight: DS.typography.fontWeight.bold,
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{
                        color: DS.colors.text.secondary,
                        fontSize: '11px',
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>

                {USER_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block',
                      color: DS.colors.text.secondary,
                      textDecoration: 'none',
                      fontSize: '15px',
                      padding: '10px 0',
                      borderBottom: `1px solid ${DS.colors.neutral.light}`,
                      transition: DS.transitions.base,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = DS.colors.primary.main)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = DS.colors.text.secondary)}
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/notificacoes"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: unread > 0 ? '#C84C3C' : DS.colors.text.secondary,
                    textDecoration: 'none',
                    fontSize: '15px',
                    padding: '10px 0',
                    borderBottom: `1px solid ${DS.colors.neutral.light}`,
                    fontWeight: unread > 0 ? '600' : '500',
                  }}
                >
                  🔔 Notificações
                  {unread > 0 && (
                    <span
                      style={{
                        backgroundColor: '#C84C3C',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: DS.typography.fontWeight.extrabold,
                        borderRadius: DS.borderRadius.full,
                        minWidth: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <>
                    <div
                      style={{
                        height: '1px',
                        backgroundColor: DS.colors.neutral.light,
                        margin: '8px 0',
                      }}
                    />
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'block',
                        color: DS.colors.primary.main,
                        textDecoration: 'none',
                        fontSize: '15px',
                        padding: '10px 0',
                        borderBottom: `1px solid ${DS.colors.neutral.light}`,
                        fontWeight: DS.typography.fontWeight.semibold,
                      }}
                    >
                      🛡️ Painel de Curadoria
                    </Link>
                    {isSuperadmin && (
                      <Link
                        href="/admin/usuarios"
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'block',
                          color: '#A855F7',
                          textDecoration: 'none',
                          fontSize: '15px',
                          padding: '10px 0',
                          borderBottom: `1px solid ${DS.colors.neutral.light}`,
                          fontWeight: DS.typography.fontWeight.semibold,
                        }}
                      >
                        ⚡ Gerenciar Usuários
                      </Link>
                    )}
                  </>
                )}

                <button
                  onClick={handleSignOut}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    backgroundColor: '#C84C3C' + '15',
                    color: '#C84C3C',
                    border: `1px solid #C84C3C30`,
                    borderRadius: DS.borderRadius.md,
                    padding: '12px',
                    fontSize: '15px',
                    fontWeight: DS.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: DS.transitions.base,
                  }}
                >
                  🚪 Sair
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: DS.colors.text.secondary,
                    textDecoration: 'none',
                    padding: '12px',
                    border: `1px solid ${DS.colors.neutral.light}`,
                    borderRadius: DS.borderRadius.md,
                    fontSize: '15px',
                  }}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    backgroundColor: DS.colors.primary.accent,
                    color: DS.colors.text.dark,
                    textDecoration: 'none',
                    padding: '12px',
                    borderRadius: DS.borderRadius.md,
                    fontSize: '15px',
                    fontWeight: DS.typography.fontWeight.semibold,
                  }}
                >
                  Começar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}

function DropItem({
  href,
  label,
  onClick,
  highlight = false,
  color = DS.colors.primary.main,
}: {
  href: string
  label: string
  onClick: () => void
  highlight?: boolean
  color?: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'block',
        color: highlight ? color : DS.colors.text.secondary,
        textDecoration: 'none',
        fontSize: '13px',
        padding: '8px 12px',
        borderRadius: DS.borderRadius.md,
        transition: DS.transitions.base,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = highlight
          ? `${color}22`
          : DS.colors.neutral.charcoal)
      }
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {label}
    </Link>
  )
}