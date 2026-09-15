'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { translateAuthError } from '@/types'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const router = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error } = await signIn(email, password)

    if (error) {
      setError(translateAuthError(error.message))
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>

      {error && (
        <div style={{
          backgroundColor: DS.colors.secondary.error + '15',
          border: `1px solid ${DS.colors.secondary.error}30`,
          borderRadius: DS.borderRadius.md,
          padding: '12px 16px',
          marginBottom: '20px',
          color: DS.colors.secondary.error,
          fontSize: DS.typography.fontSize.sm,
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = DS.colors.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = DS.colors.neutral.light)}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Senha</label>
          <Link href="/auth/esqueci-senha" style={{ color: DS.colors.primary.main, fontSize: '12px', textDecoration: 'none' }}>
            Esqueci minha senha
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = DS.colors.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = DS.colors.neutral.light)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: loading ? DS.colors.primary.dark : DS.colors.primary.main,
          color: 'white',
          border: 'none',
          borderRadius: DS.borderRadius.md,
          padding: '14px',
          fontSize: DS.typography.fontSize.base,
          fontWeight: DS.typography.fontWeight.bold,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: DS.transitions.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Entrando...</> : 'Entrar'}
      </button>

      <p style={{ textAlign: 'center', color: DS.colors.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        Ainda não tem conta?{' '}
        <Link href="/auth/signup" style={{ color: DS.colors.primary.main, fontWeight: '600', textDecoration: 'none' }}>
          Criar gratuitamente
        </Link>
      </p>
    </form>
  )
}

function Spinner() {
  return (
    <span style={{
      width: '16px', 
      height: '16px',
      border: `2px solid ${DS.colors.text.secondary}33`,
      borderTopColor: 'white', 
      borderRadius: '50%',
      display: 'inline-block', 
      animation: 'spin 0.7s linear infinite', 
      flexShrink: 0,
    }} />
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', 
  color: DS.colors.text.secondary, 
  fontSize: '13px', 
  fontWeight: '600', 
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', 
  backgroundColor: '#FFFFFF',
  border: `1.5px solid ${DS.colors.neutral.light}`,
  borderRadius: DS.borderRadius.md, 
  padding: '12px 16px', 
  color: DS.colors.text.primary,
  fontSize: '15px', 
  outline: 'none', 
  boxSizing: 'border-box', 
  transition: DS.transitions.base,
}