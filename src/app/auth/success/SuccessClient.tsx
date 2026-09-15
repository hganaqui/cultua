'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DS = DESIGN_SYSTEM

export default function SuccessClient() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary,
        border: `2px solid ${DS.colors.secondary.success}`,
        borderRadius: DS.borderRadius.xl,
        padding: '40px',
        maxWidth: '500px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 style={{
          color: DS.colors.text.dark,
          fontSize: '28px',
          fontWeight: '800',
          marginBottom: '12px',
        }}>
          Email Confirmado!
        </h1>
        <p style={{
          color: DS.colors.text.secondary,
          fontSize: '16px',
          marginBottom: '24px',
          lineHeight: 1.6,
        }}>
          Sua conta foi ativada com sucesso. Você será redirecionado para a página inicial em poucos segundos...
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: DS.colors.primary.main,
            color: 'white',
            textDecoration: 'none',
            padding: '12px 32px',
            borderRadius: DS.borderRadius.md,
            fontWeight: '700',
            transition: DS.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.light
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.main
          }}
        >
          Ir para Home Agora
        </Link>
      </div>
    </main>
  )
}