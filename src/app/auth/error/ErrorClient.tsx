'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function ErrorClient() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Erro desconhecido'

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
        border: `2px solid ${DS.colors.secondary.error}`,
        borderRadius: DS.borderRadius.xl,
        padding: '40px',
        maxWidth: '500px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
        <h1 style={{
          color: DS.colors.text.dark,
          fontSize: '28px',
          fontWeight: '800',
          marginBottom: '12px',
        }}>
          Erro na Confirmação
        </h1>
        <p style={{
          color: DS.colors.secondary.error,
          fontSize: '16px',
          marginBottom: '24px',
          lineHeight: 1.6,
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
            border: `2px solid ${DS.colors.neutral.light}`,
            transition: DS.transitions.base,
          }}>
            Voltar para Home
          </Link>
        </div>
      </div>
    </main>
  )
}