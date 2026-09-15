'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { translateAuthError } from '@/types'
import { isValidEmail } from '@/lib/utils'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function SignupForm() {
  const router = useRouter()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  const emailInvalid   = email.length > 0   && !isValidEmail(email)
  const passwordWeak   = password.length > 0 && password.length < 6
  const passwordDiff   = confirm.length > 0  && confirm !== password
  const formInvalid    = emailInvalid || passwordWeak || passwordDiff

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (formInvalid) return

    setLoading(true)
    const { error } = await signUp(email, password, name)

    if (error) {
      setError(translateAuthError(error.message))
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📬</div>
        <h2 style={{ color: DS.colors.primary.main, fontWeight: '800', fontSize: '22px', marginBottom: '12px' }}>
          Confirme seu e-mail
        </h2>
        <p style={{ color: DS.colors.text.secondary, fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
          Enviamos um link para{' '}
          <strong style={{ color: DS.colors.text.light }}>{email}</strong>.
          <br />
          Clique no link para ativar sua conta.
        </p>
        <Link href="/auth/login" style={{ color: DS.colors.primary.main, fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
          ← Voltar para o login
        </Link>
      </div>
    )
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
          fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = DS.colors.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = DS.colors.neutral.light)}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          style={{
            ...inputStyle,
            borderColor: emailInvalid ? DS.colors.secondary.error : DS.colors.neutral.light,
          }}
          onFocus={(e) => (e.target.style.borderColor = emailInvalid ? DS.colors.secondary.error : DS.colors.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = emailInvalid ? DS.colors.secondary.error : DS.colors.neutral.light)}
        />
        {emailInvalid && <Hint text="E-mail inválido" />}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          style={{
            ...inputStyle,
            borderColor: passwordWeak ? DS.colors.secondary.error : DS.colors.neutral.light,
          }}
          onFocus={(e) => (e.target.style.borderColor = passwordWeak ? DS.colors.secondary.error : DS.colors.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = passwordWeak ? DS.colors.secondary.error : DS.colors.neutral.light)}
        />
        {passwordWeak && <Hint text="Mínimo 6 caracteres" />}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Confirmar senha</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repita a senha"
          required
          style={{
            ...inputStyle,
            borderColor: passwordDiff ? DS.colors.secondary.error : DS.colors.neutral.light,
          }}
          onFocus={(e) => (e.target.style.borderColor = passwordDiff ? DS.colors.secondary.error : DS.colors.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = passwordDiff ? DS.colors.secondary.error : DS.colors.neutral.light)}
        />
        {passwordDiff && <Hint text="As senhas não coincidem" />}
      </div>

      <button
        type="submit"
        disabled={loading || formInvalid}
        style={{
          width: '100%',
          backgroundColor: loading || formInvalid ? DS.colors.primary.dark : DS.colors.primary.main,
          color: 'white',
          border: 'none',
          borderRadius: DS.borderRadius.md,
          padding: '14px',
          fontSize: DS.typography.fontSize.base,
          fontWeight: DS.typography.fontWeight.bold,
          cursor: loading || formInvalid ? 'not-allowed' : 'pointer',
          opacity: formInvalid && !loading ? 0.6 : 1,
          transition: DS.transitions.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Criando conta...</> : '🙏 Criar Conta Gratuita'}
      </button>

      <p style={{ textAlign: 'center', color: DS.colors.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        Já tem conta?{' '}
        <Link href="/auth/login" style={{ color: DS.colors.primary.main, fontWeight: '600', textDecoration: 'none' }}>
          Entrar
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

function Hint({ text }: { text: string }) {
  return (
    <span style={{ color: DS.colors.secondary.error, fontSize: '12px', marginTop: '4px', display: 'block' }}>
      {text}
    </span>
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