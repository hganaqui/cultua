import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Logo — volta para home */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/logo-cultua.jpg" 
            alt="CULTUA" 
            style={{
              width: '56px', 
              height: '56px', 
              borderRadius: DS.borderRadius.md,
              objectFit: 'cover', 
              marginBottom: '10px', 
              display: 'block', 
              margin: '0 auto 10px',
            }} 
          />
          <div style={{ 
            fontSize: '22px', 
            fontWeight: DS.typography.fontWeight.extrabold, 
            color: DS.colors.primary.main, 
            letterSpacing: '3px' 
          }}>
            CULTUA
          </div>
        </div>
      </Link>

      {/* Card */}
      <div style={{
        width: '100%', 
        maxWidth: '420px',
        backgroundColor: DS.colors.bg.secondary, 
        borderRadius: DS.borderRadius.xl,
        padding: '36px 32px', 
        border: `1px solid ${DS.colors.neutral.light}`,
      }}>
        {children}
      </div>

      {/* Animação do spinner global */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}