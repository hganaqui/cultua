'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      backgroundColor: '#1A1A1A',
      borderBottom: '2px solid #B8860B',
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

        {/* LOGO */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          flexShrink: 0,
        }}>
          <img
            src="/logo-cultua.jpg"
            alt="CULTUA"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <span style={{
            fontSize: '18px',
            fontWeight: '900',
            color: '#B8860B',
            letterSpacing: '2px',
          }}>
            CULTUA
          </span>
        </Link>

        {/* NAV - Só aparece em telas grandes */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
          className="desktop-nav"
        >
          <Link href="/" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>
            Início
          </Link>
          <Link href="/categoria/louvor" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>
            🎵 Louvor
          </Link>
          <Link href="/categoria/pregacao" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>
            📖 Pregação
          </Link>
          <Link href="/categoria/crescimento" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>
            💪 Crescimento
          </Link>
        </nav>

        {/* BOTÕES + HAMBURGER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Botões só no desktop */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
            <Link href="/auth/login" style={{
              color: '#CCCCCC',
              textDecoration: 'none',
              fontSize: '14px',
              padding: '8px 12px',
            }}>
              Entrar
            </Link>
            <Link href="/auth/signup" style={{
              backgroundColor: '#B8860B',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '8px',
            }}>
              Começar
            </Link>
          </div>

          {/* Hamburger - só no mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#B8860B',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div style={{
          backgroundColor: '#222222',
          borderTop: '1px solid #333333',
          padding: '16px',
        }}>
          {[
            { href: '/', label: 'Início' },
            { href: '/categoria/louvor', label: '🎵 Louvor' },
            { href: '/categoria/pregacao', label: '📖 Pregação' },
            { href: '/categoria/crescimento', label: '💪 Crescimento' },
            { href: '/categoria/comunidade', label: '🤝 Comunidade' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: '#CCCCCC',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '12px 0',
                borderBottom: '1px solid #333333',
              }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <Link href="/auth/login" style={{
              flex: 1,
              textAlign: 'center',
              color: '#CCCCCC',
              textDecoration: 'none',
              padding: '12px',
              border: '1px solid #444444',
              borderRadius: '8px',
              fontSize: '15px',
            }}>
              Entrar
            </Link>
            <Link href="/auth/signup" style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: '#B8860B',
              color: 'white',
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
            }}>
              Começar
            </Link>
          </div>
        </div>
      )}

      {/* CSS para responsividade */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  )
}