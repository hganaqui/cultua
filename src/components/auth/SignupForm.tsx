'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validações
      if (!formData.name.trim()) {
        setError('Nome é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.email.trim()) {
        setError('Email é obrigatório')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('Senha deve ter no mínimo 6 caracteres')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Senhas não conferem')
        setLoading(false)
        return
      }

      // ✅ Chamar signUp (que já envia email automático)
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.name
      )

      if (signUpError) {
        // Mensagens de erro mais amigáveis
        if (signUpError.message.includes('already exists')) {
          setError('Este email já está cadastrado')
        } else if (signUpError.message.includes('invalid email')) {
          setError('Email inválido')
        } else {
          setError(signUpError.message || 'Erro ao criar conta')
        }
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Erro ao criar conta')
        setLoading(false)
        return
      }

      // ✅ Sucesso — vai para página de verificação
      router.push('/auth/check-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Campo Nome */}
      <div>
        <label style={{
          display: 'block',
          color: DS.colors.text.dark,
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '6px',
        }}>
          Nome Completo
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Seu nome completo"
          required
          style={{
            width: '100%',
            padding: '12px 14px',
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.md,
            fontSize: '14px',
            color: DS.colors.text.dark,
            backgroundColor: DS.colors.bg.secondary,
            boxSizing: 'border-box',
            transition: DS.transitions.base,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.colors.primary.main
            e.currentTarget.style.boxShadow = `0 0 0 3px ${DS.colors.primary.main}20`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.colors.neutral.light
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Campo Email */}
      <div>
        <label style={{
          display: 'block',
          color: DS.colors.text.dark,
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '6px',
        }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
          style={{
            width: '100%',
            padding: '12px 14px',
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.md,
            fontSize: '14px',
            color: DS.colors.text.dark,
            backgroundColor: DS.colors.bg.secondary,
            boxSizing: 'border-box',
            transition: DS.transitions.base,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.colors.primary.main
            e.currentTarget.style.boxShadow = `0 0 0 3px ${DS.colors.primary.main}20`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.colors.neutral.light
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Campo Senha */}
      <div>
        <label style={{
          display: 'block',
          color: DS.colors.text.dark,
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '6px',
        }}>
          Senha
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.md,
            fontSize: '14px',
            color: DS.colors.text.dark,
            backgroundColor: DS.colors.bg.secondary,
            boxSizing: 'border-box',
            transition: DS.transitions.base,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.colors.primary.main
            e.currentTarget.style.boxShadow = `0 0 0 3px ${DS.colors.primary.main}20`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.colors.neutral.light
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Campo Confirmar Senha */}
      <div>
        <label style={{
          display: 'block',
          color: DS.colors.text.dark,
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '6px',
        }}>
          Confirmar Senha
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirme sua senha"
          required
          minLength={6}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.md,
            fontSize: '14px',
            color: DS.colors.text.dark,
            backgroundColor: DS.colors.bg.secondary,
            boxSizing: 'border-box',
            transition: DS.transitions.base,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.colors.primary.main
            e.currentTarget.style.boxShadow = `0 0 0 3px ${DS.colors.primary.main}20`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.colors.neutral.light
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div style={{
          backgroundColor: DS.colors.secondary.error + '15',
          border: `1px solid ${DS.colors.secondary.error}30`,
          color: DS.colors.secondary.error,
          padding: '12px 14px',
          borderRadius: DS.borderRadius.md,
          fontSize: '13px',
          fontWeight: '500',
        }}>
          ✗ {error}
        </div>
      )}

      {/* Botão Enviar */}
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? '#A8A8A8' : DS.colors.primary.main,
          color: 'white',
          border: 'none',
          padding: '12px 16px',
          borderRadius: DS.borderRadius.md,
          fontSize: '14px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: DS.transitions.base,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = DS.colors.primary.light
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = DS.colors.primary.main
          }
        }}
      >
        {loading ? '⏳ Criando conta...' : '✓ Criar Conta'}
      </button>

      {/* Link para Login */}
      <p style={{
        color: DS.colors.text.secondary,
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '8px',
      }}>
        Já tem conta?{' '}
        <Link href="/auth/login" style={{
          color: DS.colors.primary.main,
          fontWeight: '700',
          textDecoration: 'none',
          transition: DS.transitions.base,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = DS.colors.primary.light
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = DS.colors.primary.main
        }}
        >
          Entrar aqui
        </Link>
      </p>
    </form>
  )
}