// src/components/Header.tsx
import Link from 'next/link'
import { getServerUser } from '@/lib/supabase-server'
import HeaderClient from './HeaderClient'

export default async function Header() {
  const user = await getServerUser()

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

        {/* LOGO — Link é permitido em Server Component */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none', flexShrink: 0,
        }}>
          <img src="/logo-cultua.jpg" alt="CULTUA" style={{
            width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover',
          }} />
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#B8860B', letterSpacing: '2px' }}>
            CULTUA
          </span>
        </Link>

        {/* NAV desktop */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>Início</Link>
          <Link href="/categoria/louvor"      style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>🎵 Louvor</Link>
          <Link href="/categoria/pregacao"    style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>📖 Pregação</Link>
          <Link href="/categoria/crescimento" style={{ color: '#CCCCCC', textDecoration: 'none', fontSize: '14px' }}>🌱 Crescimento</Link>
        </nav>

        {/* Tudo que tem estado/interação → HeaderClient */}
        <HeaderClient user={user} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}