// src/components/HeaderClient.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { createBrowserClient } from '@supabase/ssr'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

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
  const [menuOpen, setMenuOpen]         = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount]   = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Usuário'

  const avatarUrl  = profile?.avatar_url ?? null
  const role       = profile?.role ?? 'user'
  const isAdmin    = role === 'admin' || role === 'superadmin'
  const isSuperadmin = role === 'superadmin'

  // Busca notificações não lidas
  useEffect(() => {
    if (!user) return
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)
      setUnreadCount(count ?? 0)
    }
    fetchUnread()

    // Realtime: nova notificação
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchUnread())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  // ── Avatar (foto ou inicial) ────────────────────────────────────────────
  const Avatar = ({ size = 28 }: { size?: number }) => (
    avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        style={{ 
          borderRadius: '50%', objectFit: 'cover',
          width: size, height: size, flexShrink: 0 
        }}
      />
    ) : (
      <div style={{
        width: size, height: size,
        backgroundColor: '#B8860B',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.46, fontWeight: '700', color: 'white',
        flexShrink: 0,
      }}>
        {displayName[0].toUpperCase()}
      </div>
    )
  )

  const navLinks = [
    { href: '/categoria/louvor',       label: '🎵 Louvor' },
    { href: '/categoria/pregacao',     label: '📖 Pregação' },
    { href: '/categoria/crescimento',  label: '🌱 Crescimento' },
    { href: '/categoria/testemunhos',  label: '🙏 Testemunhos' },
  ]

  const userMenuItems = [
    { href: '/perfil',        label: '👤 Meu Perfil' },
    { href: '/historico',     label: '📺 Histórico' },
    { href: '/playlist',      label: '🎵 Minhas Playlists' },
    { href: '/configuracoes', label: '⚙️ Configurações' },
    { href: '/meus-uploads',  label: '📤 Meus Uploads' },
  ]

  return (
    <>
      {/* ── Desktop auth ────────────────────────────────────────────── */}
      <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>

            {/* Botão avatar */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'transparent', border: '1.5px solid #B8860B',
                borderRadius: '9999px', padding: '5px 12px 5px 5px',
                cursor: 'pointer', color: '#CCCCCC', fontSize: '14px',
                transition: 'background-color 0.2s', position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Avatar size={28} />
              {displayName}
              {/* Badge de notificações */}
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '28px',
                  backgroundColor: '#EF4444', color: 'white',
                  fontSize: '10px', fontWeight: '700', borderRadius: '9999px',
                  minWidth: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <span style={{ fontSize: '10px', color: '#666' }}>▼</span>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                backgroundColor: '#222222', border: '1px solid #333333',
                borderRadius: '12px', padding: '8px', minWidth: '200px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 200,
              }}>
                {/* Cabeçalho do dropdown */}
                <div style={{
                  padding: '8px 12px 12px',
                  borderBottom: '1px solid #333333', marginBottom: '4px',
                }}>
                  <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>
                    {displayName}
                  </div>
                  <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>
                    {user.email}
                  </div>
                  {/* Badge de role */}
                  {isAdmin && (
                    <span style={{
                      display: 'inline-block', marginTop: '6px',
                      fontSize: '10px', fontWeight: '700',
                      backgroundColor: isSuperadmin ? 'rgba(168,85,247,0.2)' : 'rgba(184,134,11,0.2)',
                      color: isSuperadmin ? '#A855F7' : '#B8860B',
                      border: `1px solid ${isSuperadmin ? '#A855F7' : '#B8860B'}`,
                      borderRadius: '9999px', padding: '2px 8px',
                    }}>
                      {isSuperadmin ? '⚡ SUPERADMIN' : '⭐ ADMIN'}
                    </span>
                  )}
                </div>

                {/* Links usuário */}
                {userMenuItems.map(item => (
                  <DropdownLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    onClick={() => setUserMenuOpen(false)}
                  />
                ))}

                {/* Links admin */}
                {isAdmin && (
                  <>
                    <div style={{
                      height: '1px', backgroundColor: '#333', margin: '6px 0',
                    }} />
                    <DropdownLink
                      href="/admin"
                      label="🛡️ Painel de Curadoria"
                      onClick={() => setUserMenuOpen(false)}
                      highlight
                    />
                    {isSuperadmin && (
                      <DropdownLink
                        href="/admin/usuarios"
                        label="⚡ Gerenciar Usuários"
                        onClick={() => setUserMenuOpen(false)}
                        highlight
                        color="#A855F7"
                      />
                    )}
                  </>
                )}

                {/* Notificações */}
                {unreadCount > 0 && (
                  <DropdownLink
                    href="/notificacoes"
                    label={`🔔 Notificações (${unreadCount})`}
                    onClick={() => setUserMenuOpen(false)}
                  />
                )}

                {/* Logout */}
                <div style={{ height: '1px', backgroundColor: '#333', margin: '6px 0' }} />
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    backgroundColor: 'transparent', border: 'none',
                    color: '#EF4444', fontSize: '13px', padding: '8px 12px',
                    borderRadius: '8px', cursor: 'pointer',
                    transition: 'background-color 0.15s',
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

      {/* ── Mobile hamburger ────────────────────────────────────────── */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          backgroundColor: 'transparent', border: 'none', color: '#B8860B',
          fontSize: '24px', cursor: 'pointer', padding: '4px', display: 'none',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* ── Menu mobile ─────────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0,
          backgroundColor: '#222222', borderTop: '1px solid #333333',
          padding: '16px', zIndex: 99, maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
        }}>
          {[{ href: '/', label: 'Início' }, ...navLinks].map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', color: '#CCCCCC', textDecoration: 'none',
                fontSize: '16px', padding: '12px 0', borderBottom: '1px solid #333333',
              }}
            >{item.label}</Link>
          ))}

          <div style={{ marginTop: '16px' }}>
            {user ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 0', borderBottom: '1px solid #333333', marginBottom: '12px',
                }}>
                  <Avatar size={36} />
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                      {displayName}
                    </div>
                    <div style={{ color: '#666666', fontSize: '11px' }}>{user.email}</div>
                  </div>
                </div>
                {[...userMenuItems, ...(isAdmin ? [{ href: '/admin', label: '🛡️ Painel de Curadoria' }] : [])].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', color: '#CCCCCC', textDecoration: 'none',
                      fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #2a2a2a',
                    }}
                  >{item.label}</Link>
                ))}
                <button onClick={handleSignOut} style={{
                  marginTop: '12px', width: '100%',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px', padding: '12px', fontSize: '15px',
                  fontWeight: '600', cursor: 'pointer',
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
    </>
  )
}

// ── Subcomponente DropdownLink ───────────────────────────────────────────────
function DropdownLink({ 
  href, label, onClick, highlight = false, color = '#B8860B' 
}: { 
  href: string; label: string; onClick: () => void
  highlight?: boolean; color?: string 
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'block', color: highlight ? color : '#CCCCCC',
        textDecoration: 'none', fontSize: '13px',
        padding: '8px 12px', borderRadius: '8px', transition: 'background-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = highlight 
        ? `${color}22` : '#333333')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {label}
    </Link>
  )
}