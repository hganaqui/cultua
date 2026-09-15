'use client'

import { useSearchParams } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import Link from 'next/link'

const DS = DESIGN_SYSTEM

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Erro desconhecido'

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>

        <h1 style={{
          color: DS.colors.text.dark,
          fontSize: '22px',
          fontWeight: '800',
          marginBottom: '8px',
        }}>
          Erro na Confirmação
        </h1>

        <p style={{
          color: DS.colors.secondary.error,
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{
            display: 'inline-block',
            backgroundColor: DS.colors.primary.main,
            color: 'white',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: DS.borderRadius.md,
            fontWeight: '700',
            fontSize: '14px',
            transition: DS.transitions.base,
          }}>
            Tentar Novamente
          </Link>
          <Link href="/" style={{
            display: 'inline-block',
            backgroundColor: DS.colors.bg.primary,
            color: DS.colors.text.dark,
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: DS.borderRadius.md,
            fontWeight: '700',
            fontSize: '14px',
            border: `2px solid ${DS.colors.neutral.light}`,
            transition: DS.transitions.base,
          }}>
            Voltar para Home
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}