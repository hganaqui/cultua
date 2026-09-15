'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM
const SUCCESS_COLOR = '#6B7F6B'

export default function SuccessClient() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary,
        border: `2px solid ${SUCCESS_COLOR}`,
        borderRadius: DS.borderRadius.xl, padding: '40px',
        maxWidth: '500px', width: '100%', textAlign: 'center',
        boxShadow: DS.shadows.lg,
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>

        <h1 style={{
          fontFamily: DS.typography.fontFamily.heading,
          color: DS.colors.text.primary, fontSize: '28px',
          fontWeight: DS.typography.fontWeight.bold, marginBottom: '12px',
        }}>
          Email Confirmado!
        </h1>

        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary, fontSize: '16px',
          marginBottom: '28px', lineHeight: 1.6,
        }}>
          Sua conta foi ativada com sucesso.
          Você será redirecionado em poucos segundos...
        </p>

        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
          textDecoration: 'none', padding: '13px 36px',
          borderRadius: DS.borderRadius.lg,
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.semibold,
          fontSize: '15px',
          boxShadow: '0 4px 16px rgba(15,61,46,0.2)',
          transition: DS.transitions.fast,
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
        >
          Ir para Home Agora
        </Link>
      </div>
    </main>
  )
}