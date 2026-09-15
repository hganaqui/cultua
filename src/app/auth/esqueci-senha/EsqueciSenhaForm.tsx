'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function EsqueciSenhaForm() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const emailInvalid = email.length > 0 && !isValidEmail(email)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (emailInvalid || !email) return

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/nova-senha`,
      }
    )

    if (error) {
      console.error('Reset password error:', error)
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📬</div>
        <h2 style={{ 
          color: DS.colors.primary.main, 
          fontWeight: '800', 
          fontSize: '20px', 
          marginBottom: '12px' 
        }}>
          Verificamos seu e-mail!
        </h2>
        <p style={{ 
          color: DS.colors.text.secondary, 
          fontSize: '14px', 
          lineHeight: 1.7, 
          marginBottom: '8px' 
        }}>
          Se existe uma conta com{' '}
          <strong style={{ color: DS.colors.text.light }}>{email}</strong>,
          você receberá um link de redefinição.
        </p>
        <p style={{ 
          color: DS.colors.text.secondary, 
          fontSize: '13px', 
          lineHeight: 1.6, 
          marginBottom: '24px' 
        }}>
          Verifique sua caixa de entrada (e spam)<br/>
          O link expira em <strong style={{ color: DS.colors.text.light }}>1 hora</strong><br/>
          Se não receber, tente com outro e-mail
        </p>
        <Link href="/auth/login" style={{
          color: DS.colors.primary.main, 
          fontWeight: '600',
          textDecoration: 'none', 
          fontSize: '14px',
        }}>
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            borderColor: emailInvalid ? DS.colors.secondary.error : DS.colors.neutral.light,
          }}
          onFocus={(e) => {
            const input = e.currentTarget as HTMLInputElement
            input.style.borderColor = emailInvalid ? DS.colors.secondary.error : DS.colors.primary.main
          }}
          onBlur={(e) => {
            const input = e.currentTarget as HTMLInputElement
            input.style.borderColor = emailInvalid ? DS.colors.secondary.error : DS.colors.neutral.light
          }}
        />
        {emailInvalid && (
          <span style={{ color: DS.colors.secondary.error, fontSize: '12px', marginTop: '4px', display: 'block' }}>
            E-mail inválido
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || emailInvalid || !email}
        style={{
          width: '100%',
          backgroundColor: loading || emailInvalid || !email ? DS.colors.primary.dark : DS.colors.primary.main,
          color: 'white', 
          border: 'none',
          borderRadius: DS.borderRadius.md,
          padding: '14px',
          fontSize: DS.typography.fontSize.base,
          fontWeight: DS.typography.fontWeight.bold,
          cursor: loading || emailInvalid || !email ? 'not-allowed' : 'pointer',
          opacity: emailInvalid || !email ? 0.6 : 1,
          transition: DS.transitions.base,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
        }}
      >
        {loading ? <><Spinner /> Enviando...</> : 'Enviar link de redefinição'}
      </button>

      <p style={{ textAlign: 'center', color: DS.colors.text.secondary, fontSize: '14px', marginTop: '20px' }}>
        Lembrou a senha?{' '}
        <Link href="/auth/login" style={{ 
          color: DS.colors.primary.main, 
          fontWeight: '600', 
          textDecoration: 'none' 
        }}>
          Voltar ao login
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
  transition: 'border-color 0.2s',
}