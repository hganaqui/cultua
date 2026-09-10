// src/components/HeaderClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { CULTUA_CONFIG } from '@/lib/cultua-config'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const C = CULTUA_CONFIG.colors

interface HeaderClientProps {
  user: SupabaseUser | null
}

export default function HeaderClient({ user }: HeaderClientProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const displayName = user?.user_metadata?.full_name?.split(' ')[0]  // primeiro nome
    ?? user?.email?.split('@')[0]                                      // fallback: parte do email
    ?? 'Usuário'

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* ── Desktop: botões de auth ───────────────────────────────────── */}
      <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {user ? (
          // ── LOGADO: avatar + menu dropdown ────────────────────────────
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: '1.5px solid #B8860B',
                borderRadius: '9999px',
                padding: '6px 12px 6px 6px',
                cursor: 'pointer',
                color: '#CCCCCC',
                fontSize: '14px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Avatar inicial */}
              <div style={{
                width: '28px', height: '28px',
                backgroundColor: '#B8860B',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: 'white',
                flexShrink: 0,
              }}>
                {displayName[0].toUpperCase()}
              </div>
              {displayName}
              <span style={{ fontSize: '10px', color: '#666' }}>▼</span>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: '#222222',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '180px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 200,
              }}>
                {/* Info do usuário */}
                <div style={{
                  padding: '8px 12px 12px',
                  borderBottom: '1px solid #333333',
                  marginBottom: '8px',
                }}>
                  <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>{displayName}</div>
                  <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>{user.email}</div>
                </div>

                {[
                  { href: '/perfil',         label: '👤 Meu Perfil' },
                  { href: '/historico',      label: '📺 Histórico' },
                  { href: '/playlist',       label: '🎵 Minhas Playlists' },
                  { href: '/configuracoes',  label: '⚙️ Configurações' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'block',
                      color: '#CCCCCC',
                      textDecoration: 'none',
                      fontSize: '13px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '13px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    borderTop: '1px solid #333333',
                    paddingTop: '12px',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          // ── NÃO LOGADO: entrar + criar conta ──────────────────────────
          <>
            <Link href="/auth/login" style={{
              color: '#CCCCCC', textDecoration: 'none',
              fontSize: '14px', padding: '8px 12px',
            }}>
              Entrar
            </Link>
            <Link href="/auth/signup" style={{
              backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
              fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px',
            }}>
              Começar
            </Link>
          </>
        )}
      </div>

      {/* ── Mobile: hamburger ─────────────────────────────────────────── */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          backgroundColor: 'transparent', border: 'none',
          color: '#B8860B', fontSize: '24px', cursor: 'pointer',
          padding: '4px', display: 'none',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* ── Menu mobile expandido ─────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0,
          backgroundColor: '#222222', borderTop: '1px solid #333333',
          padding: '16px', zIndex: 99,
        }}>
          {[
            { href: '/',                      label: 'Início' },
            { href: '/categoria/louvor',      label: '🎵 Louvor' },
            { href: '/categoria/pregacao',    label: '📖 Pregação' },
            { href: '/categoria/crescimento', label: '🌱 Crescimento' },
            { href: '/categoria/testemunhos', label: '🙏 Testemunhos' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', color: '#CCCCCC', textDecoration: 'none',
                fontSize: '16px', padding: '12px 0', borderBottom: '1px solid #333333',
              }}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth mobile */}
          <div style={{ marginTop: '16px' }}>
            {user ? (
              <>
                {/* Usuário logado no mobile */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 0', borderBottom: '1px solid #333333', marginBottom: '12px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', backgroundColor: '#B8860B',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white',
                  }}>
                    {displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>{displayName}</div>
                    <div style={{ color: '#666666', fontSize: '11px' }}>{user.email}</div>
                  </div>
                </div>
                {[
                  { href: '/perfil',        label: '👤 Meu Perfil' },
                  { href: '/historico',     label: '📺 Histórico' },
                  { href: '/playlist',      label: '🎵 Playlists' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', color: '#CCCCCC', textDecoration: 'none',
                      fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #2a2a2a',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <button onClick={handleSignOut} style={{
                  marginTop: '12px', width: '100%', backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px', padding: '12px', fontSize: '15px',
                  fontWeight: '600', cursor: 'pointer',
                }}>
                  🚪 Sair
                </button>
              </>
            ) : (
              // Não logado no mobile
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center', color: '#CCCCCC', textDecoration: 'none',
                  padding: '12px', border: '1px solid #444444', borderRadius: '8px', fontSize: '15px',
                }}>
                  Entrar
                </Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center', backgroundColor: '#B8860B', color: 'white',
                  textDecoration: 'none', padding: '12px', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600',
                }}>
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
    </>
  )
}