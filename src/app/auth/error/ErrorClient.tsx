'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM
const ERROR_COLOR = '#C84C3C'

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
        border: `2px solid ${ERROR_COLOR}`,
        borderRadius: DS.borderRadius.xl,
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: DS.shadows.lg,
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>

        <h1 style={{
          fontFamily: DS.typography.fontFamily.heading,
          color: DS.colors.text.primary,
          fontSize: '28px',
          fontWeight: DS.typography.fontWeight.bold,
          marginBottom: '12px',
        }}>
          Erro na Confirmação
        </h1>

        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: ERROR_COLOR,
          fontSize: '16px',
          marginBottom: '28px',
          lineHeight: 1.6,
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/auth/signup" style={{
            display: 'inline-block',
            backgroundColor: DS.colors.primary.main,
            color: '#FFFFFF',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: DS.borderRadius.lg,
            fontFamily: DS.typography.fontFamily.body,
            fontWeight: DS.typography.fontWeight.semibold,
            transition: DS.transitions.fast,
          }}>
            Tentar Novamente
          </Link>

          <Link href="/" style={{
            display: 'inline-block',
            backgroundColor: DS.colors.bg.primary,
            color: DS.colors.text.primary,
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: DS.borderRadius.lg,
            fontFamily: DS.typography.fontFamily.body,
            fontWeight: DS.typography.fontWeight.semibold,
            border: `1.5px solid ${DS.colors.neutral.medium}`,
            transition: DS.transitions.fast,
          }}>
            Voltar para Home
          </Link>
        </div>
      </div>
    </main>
  )
}