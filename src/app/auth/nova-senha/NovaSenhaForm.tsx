'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

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

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Erro ao atualizar a senha. O link pode ter expirado.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => router.push('/'), 2000)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: DS.colors.primary.main, fontWeight: '800', fontSize: '20px', marginBottom: '12px' }}>
          Senha atualizada!
        </h2>
        <p style={{ color: DS.colors.text.secondary, fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
          Sua senha foi redefinida com sucesso.
          <br />
          Redirecionando para o início...
        </p>
        <Link href="/" style={{ color: DS.colors.primary.main, fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
          Ir para o início →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>

      {error && (
        <div style={{
          backgroundColor: `${DS.colors.secondary.error}15`,
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
        <label style={labelStyle}>Nova senha</label>
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
          onFocus={(e) => {
            const input = e.currentTarget as HTMLInputElement
            input.style.borderColor = passwordWeak ? DS.colors.secondary.error : DS.colors.primary.main
          }}
          onBlur={(e) => {
            const input = e.currentTarget as HTMLInputElement
            input.style.borderColor = passwordWeak ? DS.colors.secondary.error : DS.colors.neutral.light
          }}
        />
        {passwordWeak && <Hint text="Mínimo 6 caracteres" />}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Confirmar nova senha</label>
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
          onFocus={(e) => {
            const input = e.currentTarget as HTMLInputElement
            input.style.borderColor = passwordDiff ? DS.colors.secondary.error : DS.colors.primary.main
          }}
          onBlur={(e) => {
            const input = e.currentTarget as HTMLInputElement
            input.style.borderColor = passwordDiff ? DS.colors.secondary.error : DS.colors.neutral.light
          }}
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
        {loading ? <><Spinner /> Salvando...</> : '🔒 Salvar nova senha'}
      </button>

      <p style={{ textAlign: 'center', color: DS.colors.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        <Link href="/auth/login" style={{ color: DS.colors.primary.main, fontWeight: '600', textDecoration: 'none' }}>
          ← Voltar ao login
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
  transition: 'border-color 0.2s',
}