// src/components/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

// ── Tipos internos ────────────────────────────────────────────────────────────
interface ProfileState {
  role: UserRole
  avatar_url: string | null
  full_name: string | null
}

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',                       label: 'Início' },
  { href: '/categoria/louvor',       label: '🎵 Louvor' },
  { href: '/categoria/pregacao',     label: '📖 Pregação' },
  { href: '/categoria/crescimento',  label: '🌱 Crescimento' },
  { href: '/categoria/testemunhos',  label: '🙏 Testemunhos' },
  { href: '/explorar',               label: '🔍 Explorar' },
]

const USER_LINKS = [
  { href: '/perfil',        label: '👤 Meu Perfil' },
  { href: '/historico',     label: '📺 Histórico' },
  { href: '/playlist',      label: '🎵 Minhas Playlists' },
  { href: '/meus-uploads',  label: '📤 Meus Uploads' },
  { href: '/configuracoes', label: '⚙️ Configurações' },
]

export default function Header() {
  const router  = useRouter()
  const dropRef = useRef<HTMLDivElement>(null)

  const [user, setUser]         = useState<User | null>(null)
  const [profile, setProfile]   = useState<ProfileState | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [unread, setUnread]     = useState(0)

  // ── Busca profile completo ────────────────────────────────────────────────
  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('role, avatar_url, full_name')
      .eq('id', userId)
      .single()
    setProfile(data ?? { role: 'user', avatar_url: null, full_name: null })
  }

  // ── Busca notificações não lidas ──────────────────────────────────────────
  async function fetchUnread(userId: string) {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
    setUnread(count ?? 0)
  }

  // ── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      setLoading(false)
      if (u) { await fetchProfile(u.id); await fetchUnread(u.id) }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        setLoading(false)
        if (u) { await fetchProfile(u.id); await fetchUnread(u.id) }
        else   { setProfile(null); setUnread(0) }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Realtime notificações ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('header-notifications')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchUnread(user.id))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  // ── Fecha dropdown ao clicar fora ─────────────────────────────────────────
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // ── Computed ──────────────────────────────────────────────────────────────
  const role         = profile?.role ?? 'user'
  const isAdmin      = role === 'admin' || role === 'superadmin'
  const isSuperadmin = role === 'superadmin'

  const displayName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Usuário'

  const ROLE_BADGE = {
    admin:      { label: '⭐ Admin',      color: '#B8860B', bg: 'rgba(184,134,11,0.15)', border: 'rgba(184,134,11,0.3)' },
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

  // ── Avatar (foto ou inicial) ──────────────────────────────────────────────
  const Avatar = ({ size = 28 }: { size?: number }) => {
    const avatarUrl = profile?.avatar_url
    return avatarUrl ? (
      <Image
        src={avatarUrl} alt={displayName}
        width={size} height={size}
        style={{ borderRadius: '50%', objectFit: 'cover', width: size, height: size, flexShrink: 0 }}
      />
    ) : (
      <div style={{
        width: size, height: size, backgroundColor: '#B8860B', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.46, fontWeight: '700', color: 'white', flexShrink: 0,
      }}>
        {displayName[0].toUpperCase()}
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header style={{
      backgroundColor: '#1A1A1A', borderBottom: '2px solid #B8860B',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px',
      }}>

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo-cultua.jpg" alt="CULTUA"
            style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#B8860B', letterSpacing: '2px' }}>
            CULTUA
          </span>
        </Link>

        {/* ── Nav desktop ──────────────────────────────────────────────── */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {NAV_LINKS.map(item => (
            <Link key={item.href} href={item.href} style={{
              color: '#CCCCCC', textDecoration: 'none', fontSize: '14px',
              padding: '6px 10px', borderRadius: '8px', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#B8860B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#CCCCCC')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Auth desktop ─────────────────────────────────────────────── */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? (
            <div style={{
              width: '120px', height: '36px',
              backgroundColor: '#2D2D2D', borderRadius: '9999px', opacity: 0.5,
            }} />
          ) : user ? (
            <div ref={dropRef} style={{ position: 'relative' }}>

              {/* Botão avatar com badge de notificações */}
              <button
                onClick={() => setUserMenu(!userMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: 'transparent', border: '1.5px solid #B8860B',
                  borderRadius: '9999px', padding: '5px 12px 5px 5px',
                  cursor: 'pointer', color: '#CCCCCC', fontSize: '14px',
                  position: 'relative', transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Avatar size={28} />
                {displayName}
                {unread > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '26px',
                    backgroundColor: '#EF4444', color: 'white',
                    fontSize: '10px', fontWeight: '700', borderRadius: '9999px',
                    minWidth: '17px', height: '17px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', border: '2px solid #1A1A1A',
                  }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
                <span style={{ fontSize: '10px', color: '#666' }}>▼</span>
              </button>

              {/* Dropdown */}
              {userMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  backgroundColor: '#222222', border: '1px solid #333333',
                  borderRadius: '14px', padding: '8px', minWidth: '210px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200,
                }}>

                  {/* Cabeçalho dropdown */}
                  <div style={{
                    padding: '10px 12px 12px',
                    borderBottom: '1px solid #333333', marginBottom: '4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar size={36} />
                      <div>
                        <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700' }}>
                          {displayName}
                        </div>
                        <div style={{ color: '#555', fontSize: '11px' }}>{user.email}</div>
                      </div>
                    </div>
                    {badge && (
                      <span style={{
                        display: 'inline-block', marginTop: '8px',
                        backgroundColor: badge.bg, color: badge.color,
                        fontSize: '10px', fontWeight: '700', padding: '2px 10px',
                        borderRadius: '9999px', border: `1px solid ${badge.border}`,
                        letterSpacing: '0.4px',
                      }}>
                        {badge.label}
                      </span>
                    )}
                  </div>

                  {/* Links usuário */}
                  {USER_LINKS.map(item => (
                    <DropItem key={item.href} href={item.href}
                      onClick={() => setUserMenu(false)}>
                      {item.label}
                    </DropItem>
                  ))}

                  {/* Notificações */}
                  {unread > 0 && (
                    <DropItem href="/notificacoes" onClick={() => setUserMenu(false)} highlight>
                      🔔 Notificações ({unread})
                    </DropItem>
                  )}

                  {/* Links admin */}
                  {isAdmin && (
                    <>
                      <div style={{ height: '1px', backgroundColor: '#333', margin: '6px 0' }} />
                      <DropItem href="/admin" onClick={() => setUserMenu(false)} highlight>
                        🛡️ Painel de Curadoria
                      </DropItem>
                      {isSuperadmin && (
                        <DropItem href="/admin/usuarios" onClick={() => setUserMenu(false)}
                          highlight color="#A855F7">
                          ⚡ Gerenciar Usuários
                        </DropItem>
                      )}
                    </>
                  )}

                  {/* Logout */}
                  <div style={{ height: '1px', backgroundColor: '#333', margin: '6px 0' }} />
                  <button onClick={handleSignOut} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', textAlign: 'left',
                    backgroundColor: 'transparent', border: 'none',
                    color: '#EF4444', fontSize: '13px', padding: '8px 12px',
                    borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" style={{
                color: '#CCCCCC', textDecoration: 'none', fontSize: '14px', padding: '8px 12px',
              }}>Entrar</Link>
              <Link href="/auth/signup" style={{
                backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
                fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px',
              }}>Começar</Link>
            </>
          )}
        </div>

        {/* ── Hamburger mobile ─────────────────────────────────────────── */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            backgroundColor: 'transparent', border: 'none', color: '#B8860B',
            fontSize: '24px', cursor: 'pointer', padding: '4px', display: 'none',
            position: 'relative',
          }}
        >
          {menuOpen ? '✕' : '☰'}
          {/* Badge mobile */}
          {unread > 0 && !menuOpen && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              backgroundColor: '#EF4444', color: 'white',
              fontSize: '9px', fontWeight: '700', borderRadius: '9999px',
              minWidth: '14px', height: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </div>

      {/* ── Menu mobile ──────────────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0,
          backgroundColor: '#222222', borderTop: '1px solid #333333',
          padding: '16px', zIndex: 99,
          maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
        }}>
          {/* Nav links mobile */}
          {NAV_LINKS.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', color: '#CCCCCC', textDecoration: 'none',
                fontSize: '16px', padding: '12px 0', borderBottom: '1px solid #333333',
              }}>
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: '16px' }}>
            {user ? (
              <>
                {/* Perfil mobile */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 0', borderBottom: '1px solid #333333', marginBottom: '12px',
                }}>
                  <Avatar size={40} />
                  <div>
                    <div style={{ color: '#FFF', fontSize: '14px', fontWeight: '700' }}>
                      {displayName}
                    </div>
                    <div style={{ color: '#555', fontSize: '11px' }}>{user.email}</div>
                    {badge && (
                      <span style={{
                        display: 'inline-block', marginTop: '4px',
                        backgroundColor: badge.bg, color: badge.color,
                        fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                        borderRadius: '9999px', border: `1px solid ${badge.border}`,
                      }}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Links usuário mobile */}
                {USER_LINKS.map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', color: '#CCCCCC', textDecoration: 'none',
                      fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #2a2a2a',
                    }}>
                    {item.label}
                  </Link>
                ))}

                {/* Notificações mobile */}
                {unread > 0 && (
                  <Link href="/notificacoes" onClick={() => setMenuOpen(false)} style={{
                    display: 'block', color: '#EF4444', textDecoration: 'none',
                    fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #2a2a2a',
                    fontWeight: '600',
                  }}>
                    🔔 Notificações ({unread})
                  </Link>
                )}

                {/* Admin mobile */}
                {isAdmin && (
                  <>
                    <div style={{ height: '1px', backgroundColor: '#333', margin: '8px 0' }} />
                    <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                      display: 'block', color: '#B8860B', textDecoration: 'none',
                      fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #2a2a2a',
                      fontWeight: '600',
                    }}>🛡️ Painel de Curadoria</Link>
                    {isSuperadmin && (
                      <Link href="/admin/usuarios" onClick={() => setMenuOpen(false)} style={{
                        display: 'block', color: '#A855F7', textDecoration: 'none',
                        fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #2a2a2a',
                        fontWeight: '600',
                      }}>⚡ Gerenciar Usuários</Link>
                    )}
                  </>
                )}

                {/* Sair mobile */}
                <button onClick={handleSignOut} style={{
                  marginTop: '12px', width: '100%',
                  backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444',
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
                  padding: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                }}>🚪 Sair</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center', color: '#CCCCCC', textDecoration: 'none',
                  padding: '12px', border: '1px solid #444444', borderRadius: '8px', fontSize: '15px',
                }}>Entrar</Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center', backgroundColor: '#B8860B', color: 'white',
                  textDecoration: 'none', padding: '12px', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600',
                }}>Começar</Link>
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

// ── Subcomponente DropItem ────────────────────────────────────────────────────
function DropItem({
  href, onClick, children, highlight = false, color = '#B8860B',
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
  highlight?: boolean
  color?: string
}) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'block', textDecoration: 'none',
      color: highlight ? color : '#CCCCCC',
      fontSize: '13px', padding: '8px 12px', borderRadius: '8px',
      transition: 'background-color 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = highlight
        ? `${color}22` : '#333333')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {children}
    </Link>
  )
}