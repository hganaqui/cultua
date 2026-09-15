'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM
const ERROR_COLOR = '#C84C3C'

export default function NovaSenhaForm() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const passwordWeak = password.length > 0 && password.length < 6
  const passwordDiff = confirm.length > 0  && confirm !== password
  const formInvalid  = passwordWeak || passwordDiff || !password || !confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formInvalid) return
    setLoading(true); setError(null)

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Erro ao atualizar a senha. O link pode ter expirado.')
      setLoading(false); return
    }

    setSuccess(true); setLoading(false)
    setTimeout(() => router.push('/'), 2000)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{
          fontFamily: DS.typography.fontFamily.heading,
          color: DS.colors.primary.main,
          fontWeight: DS.typography.fontWeight.bold,
          fontSize: '20px', marginBottom: '12px',
        }}>
          Senha atualizada!
        </h2>
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary,
          fontSize: '14px', lineHeight: 1.7, marginBottom: '24px',
        }}>
          Sua senha foi redefinida com sucesso.<br />
          Redirecionando para o início...
        </p>
        <Link href="/" style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.primary.main,
          fontWeight: DS.typography.fontWeight.semibold,
          textDecoration: 'none', fontSize: '14px',
        }}>
          Ir para o início →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {error && (
        <div style={{
          backgroundColor: `${ERROR_COLOR}12`,
          border: `1px solid ${ERROR_COLOR}30`,
          borderRadius: DS.borderRadius.md,
          padding: '12px 16px', marginBottom: '20px',
          fontFamily: DS.typography.fontFamily.body,
          color: ERROR_COLOR, fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Nova senha</label>
        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres" required minLength={6}
          style={{ ...inputStyle, borderColor: passwordWeak ? ERROR_COLOR : DS.colors.neutral.medium }}
          onFocus={e => (e.currentTarget.style.borderColor = passwordWeak ? ERROR_COLOR : DS.colors.primary.main)}
          onBlur={e => (e.currentTarget.style.borderColor = passwordWeak ? ERROR_COLOR : DS.colors.neutral.medium)}
        />
        {passwordWeak && <Hint text="Mínimo 6 caracteres" />}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Confirmar nova senha</label>
        <input
          type="password" value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Repita a senha" required
          style={{ ...inputStyle, borderColor: passwordDiff ? ERROR_COLOR : DS.colors.neutral.medium }}
          onFocus={e => (e.currentTarget.style.borderColor = passwordDiff ? ERROR_COLOR : DS.colors.primary.main)}
          onBlur={e => (e.currentTarget.style.borderColor = passwordDiff ? ERROR_COLOR : DS.colors.neutral.medium)}
        />
        {passwordDiff && <Hint text="As senhas não coincidem" />}
      </div>

      <button
        type="submit" disabled={loading || formInvalid}
        style={{
          width: '100%',
          backgroundColor: loading || formInvalid ? DS.colors.neutral.medium : DS.colors.primary.main,
          color: '#FFFFFF', border: 'none',
          borderRadius: DS.borderRadius.lg, padding: '14px',
          fontFamily: DS.typography.fontFamily.body,
          fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
          cursor: loading || formInvalid ? 'not-allowed' : 'pointer',
          opacity: formInvalid && !loading ? 0.6 : 1,
          transition: DS.transitions.fast,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Salvando...</> : '🔒 Salvar nova senha'}
      </button>

      <p style={{ fontFamily: DS.typography.fontFamily.body, textAlign: 'center', color: DS.colors.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        <Link href="/auth/login" style={{ color: DS.colors.primary.main, fontWeight: DS.typography.fontWeight.semibold, textDecoration: 'none' }}>
          ← Voltar ao login
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
      borderTopColor: '#FFFFFF', borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.7s linear infinite', flexShrink: 0,
    }} />
  )
}

function Hint({ text }: { text: string }) {
  return (
    <span style={{
      fontFamily: DS.typography.fontFamily.body,
      color: ERROR_COLOR, fontSize: '12px', marginTop: '4px', display: 'block',
    }}>
      {text}
    </span>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: DS.typography.fontFamily.body,
  color: DS.colors.text.primary,
  fontSize: '13px', fontWeight: 600, marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: DS.colors.bg.secondary,
  border: `1.5px solid ${DS.colors.neutral.medium}`,
  borderRadius: DS.borderRadius.md, padding: '12px 16px',
  fontFamily: DS.typography.fontFamily.body,
  color: DS.colors.text.primary, fontSize: '15px',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}