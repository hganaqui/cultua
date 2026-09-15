import AuthLayout from '@/components/auth/AuthLayout'
import EsqueciSenhaForm from './EsqueciSenhaForm'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Esqueci minha senha — CULTUA' }

export default function EsqueciSenhaPage() {
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
        Esqueceu sua senha? 🔑
      </h1>
      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '28px',
      }}>
        Digite seu e-mail e enviaremos um link para redefinir
      </p>
      <EsqueciSenhaForm />
    </AuthLayout>
  )
}