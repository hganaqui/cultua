'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { createBrowserClient } from '@supabase/ssr'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

const DS = DESIGN_SYSTEM

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

  const Avatar = ({ size = 28 }: { size?: number }) => (
    avatarUrl ? (
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
        backgroundColor: DS.colors.primary.main,
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
      <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: 'transparent', 
                border: `1.5px solid ${DS.colors.primary.main}`,
                borderRadius: DS.borderRadius.full, 
                padding: '5px 12px 5px 5px',
                cursor: 'pointer', 
                color: DS.colors.text.light, 
                fontSize: '14px',
                transition: DS.transitions.base, 
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main + '15')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Avatar size={28} />
              {displayName}
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', 
                  top: '-4px', 
                  right: '28px',
                  backgroundColor: DS.colors.secondary.error, 
                  color: 'white',
                  fontSize: '10px', 
                  fontWeight: DS.typography.fontWeight.extrabold, 
                  borderRadius: DS.borderRadius.full,
                  minWidth: '16px', 
                  height: '16px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <span style={{ fontSize: '10px', color: DS.colors.text.secondary }}>▼</span>
            </button>

            {userMenuOpen && (
              <div style={{
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
              }}>
                <div style={{
                  padding: '8px 12px 12px',
                  borderBottom: `1px solid ${DS.colors.neutral.light}`, 
                  marginBottom: '4px',
                }}>
                  <div style={{ color: DS.colors.text.dark, fontSize: '13px', fontWeight: DS.typography.fontWeight.bold }}>
                    {displayName}
                  </div>
                  <div style={{ color: DS.colors.text.secondary, fontSize: '11px', marginTop: '2px' }}>
                    {user.email}
                  </div>
                  {isAdmin && (
                    <span style={{
                      display: 'inline-block', 
                      marginTop: '6px',
                      fontSize: '10px', 
                      fontWeight: DS.typography.fontWeight.extrabold,
                      backgroundColor: isSuperadmin ? 'rgba(168,85,247,0.15)' : DS.colors.primary.main + '15',
                      color: isSuperadmin ? '#A855F7' : DS.colors.primary.main,
                      border: `1px solid ${isSuperadmin ? '#A855F7' : DS.colors.primary.main}30`,
                      borderRadius: DS.borderRadius.full, 
                      padding: '2px 8px',
                    }}>
                      {isSuperadmin ? '⚡ SUPERADMIN' : '⭐ ADMIN'}
                    </span>
                  )}
                </div>

                {userMenuItems.map(item => (
                  <DropdownLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    onClick={() => setUserMenuOpen(false)}
                  />
                ))}

                {isAdmin && (
                  <>
                    <div style={{ height: '1px', backgroundColor: DS.colors.neutral.light, margin: '6px 0' }} />
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

                {unreadCount > 0 && (
                  <DropdownLink
                    href="/notificacoes"
                    label={`🔔 Notificações (${unreadCount})`}
                    onClick={() => setUserMenuOpen(false)}
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
                    color: DS.colors.secondary.error, 
                    fontSize: '13px', 
                    padding: '8px 12px',
                    borderRadius: DS.borderRadius.md, 
                    cursor: 'pointer',
                    transition: DS.transitions.base,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.secondary.error + '15')}
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
              color: DS.colors.text.secondary, 
              textDecoration: 'none', 
              fontSize: '14px', 
              padding: '8px 12px',
            }}>Entrar</Link>
            <Link href="/auth/signup" style={{
              backgroundColor: DS.colors.primary.main, 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '14px', 
              fontWeight: DS.typography.fontWeight.semibold, 
              padding: '8px 16px', 
              borderRadius: DS.borderRadius.md,
            }}>Começar</Link>
          </>
        )}
      </div>

      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          backgroundColor: 'transparent', 
          border: 'none', 
          color: DS.colors.primary.main,
          fontSize: '24px', 
          cursor: 'pointer', 
          padding: '4px', 
          display: 'none',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div style={{
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
        }}>
          {[{ href: '/', label: 'Início' }, ...navLinks].map(item => (
            <Link key={item.href} href={item.href}
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
            >{item.label}</Link>
          ))}

          <div style={{ marginTop: '16px' }}>
            {user ? (
              <>
                <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '12px 0', 
                  borderBottom: `1px solid ${DS.colors.neutral.light}`, 
                  marginBottom: '12px',
                }}>
                  <Avatar size={36} />
                  <div>
                    <div style={{ color: DS.colors.text.dark, fontSize: '14px', fontWeight: DS.typography.fontWeight.bold }}>
                      {displayName}
                    </div>
                    <div style={{ color: DS.colors.text.secondary, fontSize: '11px' }}>{user.email}</div>
                  </div>
                </div>
                {[...userMenuItems, ...(isAdmin ? [{ href: '/admin', label: '🛡️ Painel de Curadoria' }] : [])].map(item => (
                  <Link key={item.href} href={item.href}
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
                  >{item.label}</Link>
                ))}
                <button onClick={handleSignOut} style={{
                  marginTop: '12px', 
                  width: '100%',
                  backgroundColor: DS.colors.secondary.error + '15',
                  color: DS.colors.secondary.error, 
                  border: `1px solid ${DS.colors.secondary.error}30`,
                  borderRadius: DS.borderRadius.md, 
                  padding: '12px', 
                  fontSize: '15px',
                  fontWeight: DS.typography.fontWeight.semibold, 
                  cursor: 'pointer',
                  transition: DS.transitions.base,
                }}>🚪 Sair</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, 
                  textAlign: 'center', 
                  color: DS.colors.text.secondary, 
                  textDecoration: 'none',
                  padding: '12px', 
                  border: `1px solid ${DS.colors.neutral.light}`, 
                  borderRadius: DS.borderRadius.md, 
                  fontSize: '15px',
                }}>Entrar</Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, 
                  textAlign: 'center', 
                  backgroundColor: DS.colors.primary.main, 
                  color: 'white',
                  textDecoration: 'none', 
                  padding: '12px', 
                  borderRadius: DS.borderRadius.md,
                  fontSize: '15px', 
                  fontWeight: DS.typography.fontWeight.semibold,
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

function DropdownLink({ 
  href, label, onClick, highlight = false, color = DS.colors.primary.main
}: { 
  href: string; 
  label: string; 
  onClick: () => void
  highlight?: boolean; 
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
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = highlight 
        ? `${color}22` : DS.colors.neutral.charcoal)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {label}
    </Link>
  )
}