// src/app/auth/nova-senha/NovaSenhaForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { CULTUA_CONFIG } from '@/lib/cultua-config'

const C = CULTUA_CONFIG.colors

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

    // Redireciona para home após 2s
    setTimeout(() => router.push('/'), 2000)
  }

  // ── Sucesso ─────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: C.primary.main, fontWeight: '800', fontSize: '20px', marginBottom: '12px' }}>
          Senha atualizada!
        </h2>
        <p style={{ color: '#999999', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
          Sua senha foi redefinida com sucesso.
          <br />
          Redirecionando para o início...
        </p>
        <Link href="/" style={{ color: C.primary.main, fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
          Ir para o início →
        </Link>
      </div>
    )
  }

  // ── Formulário ──────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>

      {error && (
        <div style={{
          backgroundColor: 'rgba(231,76,60,0.1)',
          border: '1px solid rgba(231,76,60,0.3)',
          borderRadius: CULTUA_CONFIG.borderRadius.md,
          padding: '12px 16px', marginBottom: '20px',
          color: '#F87171', fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Nova senha */}
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
            borderColor: passwordWeak ? '#EF4444' : '#3D3D3D',
          }}
          onFocus={(e) => (e.target.style.borderColor = passwordWeak ? '#EF4444' : C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = passwordWeak ? '#EF4444' : '#3D3D3D')}
        />
        {passwordWeak && <Hint text="Mínimo 6 caracteres" />}
      </div>

      {/* Confirmar nova senha */}
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
            borderColor: passwordDiff ? '#EF4444' : '#3D3D3D',
          }}
          onFocus={(e) => (e.target.style.borderColor = passwordDiff ? '#EF4444' : C.primary.main)}
          onBlur={(e)  => (e.target.style.borderColor = passwordDiff ? '#EF4444' : '#3D3D3D')}
        />
        {passwordDiff && <Hint text="As senhas não coincidem" />}
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={loading || formInvalid}
        style={{
          width: '100%',
          backgroundColor: loading || formInvalid ? C.primary.dark : C.primary.main,
          color: 'white', border: 'none',
          borderRadius: CULTUA_CONFIG.borderRadius.md,
          padding: '14px',
          fontSize: CULTUA_CONFIG.typography.fontSize.base,
          fontWeight: CULTUA_CONFIG.typography.fontWeight.bold,
          cursor: loading || formInvalid ? 'not-allowed' : 'pointer',
          opacity: formInvalid && !loading ? 0.6 : 1,
          transition: CULTUA_CONFIG.transitions.base,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Salvando...</> : '🔒 Salvar nova senha'}
      </button>

      <p style={{ textAlign: 'center', color: '#666666', fontSize: '14px', marginTop: '20px' }}>
        <Link href="/auth/login" style={{ color: C.primary.main, fontWeight: '600', textDecoration: 'none' }}>
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
      borderTopColor: 'white', borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.7s linear infinite', flexShrink: 0,
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

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#CCCCCC',
  fontSize: '13px', fontWeight: '600', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#2D2D2D',
  border: '1.5px solid #3D3D3D', borderRadius: '10px',
  padding: '12px 16px', color: '#FFFFFF', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}