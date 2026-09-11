// src/app/auth/esqueci-senha/EsqueciSenhaForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import { CULTUA_CONFIG } from '@/lib/cultua-config'

const C = CULTUA_CONFIG.colors

export default function EsqueciSenhaForm() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const emailInvalid = email.length > 0 && !isValidEmail(email)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (emailInvalid || !email) return

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/nova-senha`,
    })

    if (error) {
      setError('Erro ao enviar o e-mail. Verifique o endereço e tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  // ── Tela de sucesso ─────────────────────────────────────────
  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📬</div>
        <h2 style={{ color: C.primary.main, fontWeight: '800', fontSize: '20px', marginBottom: '12px' }}>
          E-mail enviado!
        </h2>
        <p style={{ color: '#999999', fontSize: '14px', lineHeight: 1.7, marginBottom: '8px' }}>
          Enviamos o link para{' '}
          <strong style={{ color: '#CCCCCC' }}>{email}</strong>.
        </p>
        <p style={{ color: '#666666', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
          Verifique sua caixa de entrada e spam.
          O link expira em <strong style={{ color: '#CCCCCC' }}>1 hora</strong>.
        </p>
        <Link href="/auth/login" style={{
          color: C.primary.main, fontWeight: '600',
          textDecoration: 'none', fontSize: '14px',
        }}>
          ← Voltar para o login
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

      {/* Email */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>E-mail cadastrado</label>
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
        {emailInvalid && (
          <span style={{ color: '#F87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            E-mail inválido
          </span>
        )}
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={loading || emailInvalid || !email}
        style={{
          width: '100%',
          backgroundColor: loading || emailInvalid || !email ? C.primary.dark : C.primary.main,
          color: 'white', border: 'none',
          borderRadius: CULTUA_CONFIG.borderRadius.md,
          padding: '14px',
          fontSize: CULTUA_CONFIG.typography.fontSize.base,
          fontWeight: CULTUA_CONFIG.typography.fontWeight.bold,
          cursor: loading || emailInvalid || !email ? 'not-allowed' : 'pointer',
          opacity: emailInvalid || !email ? 0.6 : 1,
          transition: CULTUA_CONFIG.transitions.base,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Enviando...</> : '📩 Enviar link de redefinição'}
      </button>

      <p style={{ textAlign: 'center', color: '#666666', fontSize: '14px', marginTop: '20px' }}>
        Lembrou a senha?{' '}
        <Link href="/auth/login" style={{ color: C.primary.main, fontWeight: '600', textDecoration: 'none' }}>
          Voltar ao login
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