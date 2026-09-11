// src/app/auth/esqueci-senha/page.tsx
import AuthLayout from '@/components/auth/AuthLayout'
import EsqueciSenhaForm from './EsqueciSenhaForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Esqueci minha senha' }

export default function EsqueciSenhaPage() {
  return (
    <AuthLayout>
      <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '800', marginBottom: '6px', textAlign: 'center' }}>
        Esqueceu sua senha? 🔑
      </h1>
      <p style={{ color: '#666666', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
        Digite seu e-mail e enviaremos um link para redefinir
      </p>
      <EsqueciSenhaForm />
    </AuthLayout>
  )
}