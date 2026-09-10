// src/app/auth/login/page.tsx
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Entrar' }

// Recebe o searchParam `redirect` para voltar após login
export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  return (
    <AuthLayout>
      <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '800', marginBottom: '6px', textAlign: 'center' }}>
        Bem-vindo de volta 🙏
      </h1>
      <p style={{ color: '#666666', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
        Entre para acessar seu conteúdo
      </p>
      {/* Passa o redirect para o form redirecionar corretamente após login */}
      <LoginForm redirectTo={searchParams.redirect ?? '/'} />
    </AuthLayout>
  )
}