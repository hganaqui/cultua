import AuthLayout from '@/components/auth/AuthLayout'
import NovaSenhaForm from './NovaSenhaForm'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Nova senha — CULTUA' }

export default function NovaSenhaPage() {
  return (
    <AuthLayout>
      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        color: DS.colors.text.primary,
        fontSize: '22px',
        fontWeight: DS.typography.fontWeight.bold,
        marginBottom: '6px',
        textAlign: 'center',
      }}>
        Criar nova senha 🔒
      </h1>
      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '28px',
      }}>
        Digite sua nova senha abaixo
      </p>
      <NovaSenhaForm />
    </AuthLayout>
  )
}