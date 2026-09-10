// src/app/auth/login/page.tsx
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Entrar' }

// ✅ Next.js 16: searchParams é Promise, precisa de await
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }> // ← Promise agora
}) {
  const params = await searchParams            // ← await obrigatório
  const redirectTo = params.redirect ?? '/'

  return (
    <AuthLayout>
      <h1 style={{
        color: '#FFFFFF', fontSize: '22px', fontWeight: '800',
        marginBottom: '6px', textAlign: 'center',
      }}>
        Bem-vindo🙏
      </h1>
      <p style={{
        color: '#666666', fontSize: '14px',
        textAlign: 'center', marginBottom: '28px',
      }}>
        Entre para acessar seu conteúdo
      </p>
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  )
}