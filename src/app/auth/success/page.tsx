'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import Link from 'next/link'

const DS = DESIGN_SYSTEM

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>

        <h1 style={{
          color: DS.colors.text.dark,
          fontSize: '22px',
          fontWeight: '800',
          marginBottom: '8px',
        }}>
          Email Confirmado!
        </h1>

        <p style={{
          color: DS.colors.text.secondary,
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          Sua conta foi ativada com sucesso. Você será redirecionado para a página inicial em poucos segundos...
        </p>

        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: DS.colors.primary.main,
          color: 'white',
          textDecoration: 'none',
          padding: '12px 24px',
          borderRadius: DS.borderRadius.md,
          fontWeight: '700',
          fontSize: '14px',
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
    </AuthLayout>
  )
}