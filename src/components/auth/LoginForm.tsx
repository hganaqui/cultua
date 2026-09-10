// src/components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { translateAuthError } from '@/types'
import { CULTUA_CONFIG } from '@/lib/cultua-config'

const C = CULTUA_CONFIG.colors

interface LoginFormProps {
  redirectTo?: string
}

// ✅ prop desestruturada com default '/'
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

    const { error } = await signIn(email, password)

    if (error) {
      setError(translateAuthError(error.message))
      setLoading(false)
      return
    }

    router.push(redirectTo) // ✅ agora existe no escopo
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>

      {error && (
        <div style={{
          backgroundColor: 'rgba(231,76,60,0.1)',
          border: '1px solid rgba(231,76,60,0.3)',
          borderRadius: CULTUA_CONFIG.borderRadius.md,
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#F87171',
          fontSize: CULTUA_CONFIG.typography.fontSize.sm,
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
          onFocus={(e) => (e.target.style.borderColor = C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = '#3D3D3D')}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Senha</label>
          <Link href="/auth/esqueci-senha" style={{ color: C.primary.main, fontSize: '12px', textDecoration: 'none' }}>
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
          onFocus={(e) => (e.target.style.borderColor = C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = '#3D3D3D')}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: loading ? C.primary.dark : C.primary.main,
          color: 'white',
          border: 'none',
          borderRadius: CULTUA_CONFIG.borderRadius.md,
          padding: '14px',
          fontSize: CULTUA_CONFIG.typography.fontSize.base,
          fontWeight: CULTUA_CONFIG.typography.fontWeight.bold,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: CULTUA_CONFIG.transitions.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Entrando...</> : '🙏 Entrar'}
      </button>

      <p style={{ textAlign: 'center', color: C.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        Ainda não tem conta?{' '}
        <Link href="/auth/signup" style={{ color: C.primary.main, fontWeight: '600', textDecoration: 'none' }}>
          Criar gratuitamente
        </Link>
      </p>
    </form>
  )
}

function Spinner() {
  return (
    <span style={{
      width: '16px', height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: 'white', borderRadius: '50%',
      display: 'inline-block', animation: 'spin 0.7s linear infinite', flexShrink: 0,
    }} />
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#CCCCCC', fontSize: '13px', fontWeight: '600', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#2D2D2D', border: '1.5px solid #3D3D3D',
  borderRadius: '10px', padding: '12px 16px', color: '#FFFFFF',
  fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}