// src/components/auth/SignupForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { translateAuthError } from '@/types'
import { isValidEmail } from '@/lib/utils'      // já existe em utils.ts!
import { CULTUA_CONFIG } from '@/lib/cultua-config'

const C = CULTUA_CONFIG.colors

export default function SignupForm() {
  const router = useRouter()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  // Validações inline — usando isValidEmail de utils.ts que já existe
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

  // ── Tela pós-cadastro ───────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📬</div>
        <h2 style={{ color: C.primary.main, fontWeight: '800', fontSize: '22px', marginBottom: '12px' }}>
          Confirme seu e-mail
        </h2>
        <p style={{ color: '#999999', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
          Enviamos um link para{' '}
          <strong style={{ color: '#CCCCCC' }}>{email}</strong>.
          <br />
          Clique no link para ativar sua conta.
        </p>
        <Link href="/auth/login" style={{ color: C.primary.main, fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
          ← Voltar para o login
        </Link>
      </div>
    )
  }

  // ── Formulário ──────────────────────────────────────────────────────────
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
          fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Nome */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = '#3D3D3D')}
        />
      </div>

      {/* Email */}
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
            borderColor: emailInvalid ? '#EF4444' : '#3D3D3D',
          }}
          onFocus={(e) => (e.target.style.borderColor = emailInvalid ? '#EF4444' : C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = emailInvalid ? '#EF4444' : '#3D3D3D')}
        />
        {emailInvalid && <Hint text="E-mail inválido" />}
      </div>

      {/* Senha */}
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
            borderColor: passwordWeak ? '#EF4444' : '#3D3D3D',
          }}
          onFocus={(e) => (e.target.style.borderColor = passwordWeak ? '#EF4444' : C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = passwordWeak ? '#EF4444' : '#3D3D3D')}
        />
        {passwordWeak && <Hint text="Mínimo 6 caracteres" />}
      </div>

      {/* Confirmar senha */}
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
            borderColor: passwordDiff ? '#EF4444' : '#3D3D3D',
          }}
          onFocus={(e) => (e.target.style.borderColor = passwordDiff ? '#EF4444' : C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = passwordDiff ? '#EF4444' : '#3D3D3D')}
        />
        {passwordDiff && <Hint text="As senhas não coincidem" />}
      </div>

      <button
        type="submit"
        disabled={loading || formInvalid}
        style={{
          width: '100%',
          backgroundColor: loading || formInvalid ? C.primary.dark : C.primary.main,
          color: 'white',
          border: 'none',
          borderRadius: CULTUA_CONFIG.borderRadius.md,
          padding: '14px',
          fontSize: CULTUA_CONFIG.typography.fontSize.base,
          fontWeight: CULTUA_CONFIG.typography.fontWeight.bold,
          cursor: loading || formInvalid ? 'not-allowed' : 'pointer',
          opacity: formInvalid && !loading ? 0.6 : 1,
          transition: CULTUA_CONFIG.transitions.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Criando conta...</> : '🙏 Criar Conta Gratuita'}
      </button>

      <p style={{ textAlign: 'center', color: C.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        Já tem conta?{' '}
        <Link href="/auth/login" style={{ color: C.primary.main, fontWeight: '600', textDecoration: 'none' }}>
          Entrar
        </Link>
      </p>
    </form>
  )
}

// ── Sub-componentes ─────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span style={{
      width: '16px', height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
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
    <span style={{ color: '#F87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>
      {text}
    </span>
  )
}

// ── Estilos ──────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', color: '#CCCCCC', fontSize: '13px', fontWeight: '600', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#2D2D2D', border: '1.5px solid #3D3D3D',
  borderRadius: '10px', padding: '12px 16px', color: '#FFFFFF',
  fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}