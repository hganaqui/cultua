'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM
const ERROR_COLOR   = '#C84C3C'
const SUCCESS_COLOR = '#6B7F6B'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data, error: signUpError } = await signUp(email, password, name)
      if (signUpError) { setError(signUpError.message); setLoading(false); return }
      if (!data.user)  { setError('Erro ao criar conta'); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => router.push('/auth/check-email'), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{
          backgroundColor: DS.colors.bg.secondary,
          border: `2px solid ${SUCCESS_COLOR}`,
          borderRadius: DS.borderRadius.xl, padding: '40px',
          maxWidth: '500px', width: '100%', textAlign: 'center',
          boxShadow: DS.shadows.lg,
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            color: DS.colors.text.primary, fontSize: '28px',
            fontWeight: DS.typography.fontWeight.bold, marginBottom: '12px',
          }}>
            Conta Criada!
          </h1>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary, fontSize: '16px',
            marginBottom: '24px', lineHeight: 1.6,
          }}>
            Verifique seu email para confirmar sua conta.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary,
        border: `1px solid ${DS.colors.neutral.light}`,
        borderRadius: DS.borderRadius.xl, padding: '40px',
        maxWidth: '400px', width: '100%',
        boxShadow: DS.shadows.md,
      }}>
        <h1 style={{
          fontFamily: DS.typography.fontFamily.heading,
          color: DS.colors.primary.main, fontSize: '28px',
          fontWeight: DS.typography.fontWeight.bold,
          marginBottom: '4px', textAlign: 'center', letterSpacing: '2px',
        }}>
          CULTUA
        </h1>
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary, fontSize: '14px',
          textAlign: 'center', marginBottom: '28px',
        }}>
          Crie sua conta
        </p>

        {error && (
          <div style={{
            backgroundColor: `${ERROR_COLOR}12`,
            border: `1px solid ${ERROR_COLOR}40`,
            color: ERROR_COLOR, borderRadius: DS.borderRadius.md,
            padding: '12px 14px', marginBottom: '16px',
            fontFamily: DS.typography.fontFamily.body, fontSize: '14px',
          }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
          {[
            { type: 'text',     value: name,     onChange: setName,     placeholder: 'Nome completo'            },
            { type: 'email',    value: email,    onChange: setEmail,    placeholder: 'Email'                    },
            { type: 'password', value: password, onChange: setPassword, placeholder: 'Senha (mín. 6 caracteres)' },
          ].map(field => (
            <input
              key={field.type}
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              required
              minLength={field.type === 'password' ? 6 : undefined}
              style={{
                padding: '12px 14px',
                border: `1.5px solid ${DS.colors.neutral.medium}`,
                borderRadius: DS.borderRadius.md,
                fontFamily: DS.typography.fontFamily.body,
                fontSize: '14px',
                color: DS.colors.text.primary,
                backgroundColor: DS.colors.bg.secondary,
                outline: 'none',
                boxSizing: 'border-box' as const,
                width: '100%',
                transition: DS.transitions.fast,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = DS.colors.primary.main)}
              onBlur={e => (e.currentTarget.style.borderColor = DS.colors.neutral.medium)}
            />
          ))}

          <button
            type="submit" disabled={loading}
            style={{
              backgroundColor: loading ? DS.colors.neutral.medium : DS.colors.primary.main,
              color: '#FFFFFF', border: 'none',
              padding: '13px', borderRadius: DS.borderRadius.lg,
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: DS.transitions.fast,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(15,61,46,0.2)',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = DS.colors.primary.light }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = DS.colors.primary.main }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary, fontSize: '13px',
          textAlign: 'center', marginTop: '16px',
        }}>
          Já tem conta?{' '}
          <Link href="/auth/login" style={{
            color: DS.colors.primary.main,
            fontWeight: DS.typography.fontWeight.semibold,
            textDecoration: 'none',
          }}>
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}