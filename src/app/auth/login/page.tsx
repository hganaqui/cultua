import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Entrar — CULTUA' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const redirectTo = params.redirect ?? '/'

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
        Bem-vindo 🙏
      </h1>
      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '28px',
      }}>
        Entre para acessar seu conteúdo
      </p>
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  )
}