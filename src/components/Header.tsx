// src/components/Header.tsx
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
        height: '64px',
      }}>

        {/* LOGO */}
      {/* LOGO */}
<Link href="/" style={{
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
}}>
  <img
    src="/logo-cultua.jpg"
    alt="CULTUA"
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      objectFit: 'cover',
    }}
  />
  <span style={{
    fontSize: '22px',
    fontWeight: '900',
    color: '#B8860B',
    letterSpacing: '2px',
  }}>
    CULTUA
  </span>
</Link>

        {/* NAV - Desktop */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }} className="hidden-mobile">
          <Link href="/" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Início
          </Link>
          <Link href="/categoria/louvor" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            🎵 Louvor
          </Link>
          <Link href="/categoria/pregacao" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            📖 Pregação
          </Link>
          <Link href="/categoria/crescimento" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            💪 Crescimento
          </Link>
        </nav>

        {/* BOTÕES */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/auth/login" style={{
            color: '#CCCCCC',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 16px',
          }}>
            Entrar
          </Link>
          <Link href="/auth/signup" style={{
            backgroundColor: '#B8860B',
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            padding: '8px 20px',
            borderRadius: '8px',
            border: '2px solid #B8860B',
          }}>
            Começar
          </Link>
        </div>
      </div>
    </header>
  )
}