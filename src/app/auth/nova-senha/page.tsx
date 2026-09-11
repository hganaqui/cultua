// src/app/auth/nova-senha/page.tsx
import AuthLayout from '@/components/auth/AuthLayout'
import NovaSenhaForm from './NovaSenhaForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nova senha' }

export default function NovaSenhaPage() {
  return (
    <AuthLayout>
      <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '800', marginBottom: '6px', textAlign: 'center' }}>
        Criar nova senha 🔒
      </h1>
      <p style={{ color: '#666666', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
        Digite sua nova senha abaixo
      </p>
      <NovaSenhaForm />
    </AuthLayout>
  )
}