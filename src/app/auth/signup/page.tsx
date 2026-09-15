import AuthLayout from '@/components/auth/AuthLayout'
import SignupForm from '@/components/auth/SignupForm'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Criar Conta' }

export default function SignupPage() {
  return (
    <AuthLayout>
      <h1 style={{ color: DS.colors.text.dark, fontSize: '22px', fontWeight: '800', marginBottom: '6px', textAlign: 'center' }}>
        Criar conta gratuita
      </h1>
      <p style={{ color: DS.colors.text.secondary, fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
        Acesse conteúdo cristão
      </p>
      <SignupForm />
    </AuthLayout>
  )
}