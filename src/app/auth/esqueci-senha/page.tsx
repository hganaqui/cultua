import AuthLayout from '@/components/auth/AuthLayout'
import EsqueciSenhaForm from './EsqueciSenhaForm'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Esqueci minha senha' }

export default function EsqueciSenhaPage() {
  return (
    <AuthLayout>
      <h1 style={{ color: DS.colors.text.dark, fontSize: '22px', fontWeight: '800', marginBottom: '6px', textAlign: 'center' }}>
        Esqueceu sua senha? 🔑
      </h1>
      <p style={{ color: DS.colors.text.secondary, fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
        Digite seu e-mail e enviaremos um link para redefinir
      </p>
      <EsqueciSenhaForm />
    </AuthLayout>
  )
}