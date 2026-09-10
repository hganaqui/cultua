// src/components/auth/AuthLayout.tsx — componente compartilhado
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Logo — volta para home */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo-cultua.jpg" alt="CULTUA" style={{
            width: '56px', height: '56px', borderRadius: '14px',
            objectFit: 'cover', marginBottom: '10px', display: 'block', margin: '0 auto 10px',
          }} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#B8860B', letterSpacing: '3px' }}>
            CULTUA
          </div>
        </div>
      </Link>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px',
        backgroundColor: '#222222', borderRadius: '20px',
        padding: '36px 32px', border: '1px solid #333333',
      }}>
        {children}
      </div>

      {/* Animação do spinner global */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}