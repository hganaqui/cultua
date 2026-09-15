'use client'

import AuthLayout from '@/components/auth/AuthLayout'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import Link from 'next/link'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

// Não pode usar metadata em client component, então crie uma versão server se precisar
export default function CheckEmailPage() {
  return (
    <AuthLayout>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📧</div>

        <h1 style={{
          color: DS.colors.text.dark,
          fontSize: '22px',
          fontWeight: '800',
          marginBottom: '8px',
        }}>
          Verifique seu Email!
        </h1>

        <p style={{
          color: DS.colors.text.secondary,
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          Enviamos um link de confirmação para seu email. Clique nele para ativar sua conta.
        </p>

        <div style={{
          backgroundColor: DS.colors.primary.accent + '15',
          border: `1px solid ${DS.colors.primary.accent}30`,
          borderRadius: DS.borderRadius.md,
          padding: '12px 14px',
          marginBottom: '24px',
          fontSize: '12px',
          color: DS.colors.text.secondary,
          lineHeight: '1.5',
        }}>
          💡 <strong>Dica:</strong> Verifique sua pasta de SPAM se não receber o email
        </div>

        <p style={{
          color: DS.colors.text.secondary,
          fontSize: '13px',
          marginTop: '16px',
        }}>
          Não recebeu?{' '}
          <Link href="/auth/signup" style={{
            color: DS.colors.primary.main,
            fontWeight: '700',
            textDecoration: 'none',
          }}>
            Tentar novamente
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}