'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await signUp(email, password, name)

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Erro ao criar conta')
        setLoading(false)
        return
      }

      setSuccess(true)
      // ✅ Já envia email automático via auth.ts
      setTimeout(() => {
        router.push('/auth/check-email')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: DS.colors.bg.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}>
        <div style={{
          backgroundColor: DS.colors.bg.secondary,
          border: `2px solid ${DS.colors.secondary.success}`,
          borderRadius: DS.borderRadius.xl,
          padding: '40px',
          maxWidth: '500px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{
            color: DS.colors.text.dark,
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '12px',
          }}>
            Conta Criada!
          </h1>
          <p style={{
            color: DS.colors.text.secondary,
            fontSize: '16px',
            marginBottom: '24px',
            lineHeight: 1.6,
          }}>
            Verifique seu email para confirmar sua conta.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary,
        border: `1px solid ${DS.colors.neutral.light}`,
        borderRadius: DS.borderRadius.xl,
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h1 style={{
          color: DS.colors.text.dark,
          fontSize: '28px',
          fontWeight: '800',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          ✨ CULTUA
        </h1>
        <p style={{
          color: DS.colors.text.secondary,
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          Crie sua conta
        </p>

        {error && (
          <div style={{
            backgroundColor: DS.colors.secondary.error + '15',
            border: `1px solid ${DS.colors.secondary.error}`,
            color: DS.colors.secondary.error,
            padding: '12px',
            borderRadius: DS.borderRadius.md,
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: '12px',
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: DS.borderRadius.md,
              fontSize: '14px',
              color: DS.colors.text.dark,
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: DS.borderRadius.md,
              fontSize: '14px',
              color: DS.colors.text.dark,
            }}
          />

          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={{
              padding: '12px',
              border: `1px solid ${DS.colors.neutral.light}`,
              borderRadius: DS.borderRadius.md,
              fontSize: '14px',
              color: DS.colors.text.dark,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#A8A8A8' : DS.colors.primary.main,
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: DS.borderRadius.md,
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p style={{
          color: DS.colors.text.secondary,
          fontSize: '13px',
          textAlign: 'center',
          marginTop: '16px',
        }}>
          Já tem conta?{' '}
          <Link href="/auth/login" style={{ color: DS.colors.primary.main, fontWeight: '700' }}>
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}