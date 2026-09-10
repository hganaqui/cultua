// src/app/auth/signup/page.tsx
import AuthLayout from '@/components/auth/AuthLayout'
import SignupForm from '@/components/auth/SignupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Criar Conta' }

export default function SignupPage() {
  return (
    <AuthLayout>
      <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '800', marginBottom: '6px', textAlign: 'center' }}>
        Criar conta gratuita ✨
      </h1>
      <p style={{ color: '#666666', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
        Acesse conteúdo cristão curado e sem anúncios
      </p>
      <SignupForm />
    </AuthLayout>
  )
}