'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { createBrowserClient } from '@supabase/ssr'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Profile } from '@/types'

const DS = DESIGN_SYSTEM

const SUCCESS_COLOR = '#6B7F6B'
const ERROR_COLOR   = '#C84C3C'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  profile: Profile
  email:   string
}

export default function ConfiguracoesClient({ profile, email }: Props) {
  const router = useRouter()

  const [fullName, setFullName]           = useState('')
  const [avatarUrl, setAvatarUrl]         = useState('')
  const [imgError, setImgError]           = useState(false)
  const [dataLoaded, setDataLoaded]       = useState(false)

  const [savingName, setSavingName]       = useState(false)
  const [nameMsg, setNameMsg]             = useState('')

  const [newPwd, setNewPwd]               = useState('')
  const [savingPwd, setSavingPwd]         = useState(false)
  const [pwdMsg, setPwdMsg]               = useState('')

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarMsg, setAvatarMsg]             = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [loggingOut, setLoggingOut]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setAvatarUrl(profile.avatar_url ?? '')

      if (!profile.full_name && email) {
        const defaultName = email.split('@')[0]
        setFullName(defaultName)
        fetch('/api/admin/init-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: defaultName, avatar_url: null }),
        }).catch(err => console.error('[Configuracoes] init-profile:', err))
      }
    }
    setDataLoaded(true)
  }, [profile, email])

  const displayName = fullName
    ? fullName.split(' ')[0]
    : email.split('@')[0] || 'Usuário'

  async function handleSaveName() {
    if (!fullName.trim()) { setNameMsg('❌ Digite um nome.'); return }
    setSavingName(true); setNameMsg('')
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', profile.id)
      if (error) { setNameMsg('❌ Erro ao salvar nome.'); return }
      setFullName(fullName.trim())
      setNameMsg('✅ Nome atualizado!')
      setTimeout(() => { setNameMsg(''); router.refresh() }, 1500)
    } catch {
      setNameMsg('❌ Erro ao salvar.')
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePwd() {
    if (newPwd.length < 6) { setPwdMsg('❌ Mínimo 6 caracteres.'); return }
    setSavingPwd(true); setPwdMsg('')
    try {
      const { error } = await supabase.auth.updateUser({ password: newPwd })
      if (error) { setPwdMsg('❌ ' + error.message); return }
      setPwdMsg('✅ Senha alterada com sucesso!')
      setNewPwd('')
      setTimeout(() => setPwdMsg(''), 4000)
    } catch {
      setPwdMsg('❌ Erro ao alterar senha.')
    } finally {
      setSavingPwd(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setAvatarMsg('❌ Selecione uma imagem.'); return }
    if (file.size > 2 * 1024 * 1024)     { setAvatarMsg('❌ Máximo 2MB.'); return }

    setUploadingAvatar(true); setAvatarMsg('')
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res  = await fetch('/api/upload-avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setAvatarMsg('❌ ' + (data.error ?? 'Erro ao enviar.')); return }
      setImgError(false)
      setAvatarUrl(data.url + `?t=${Date.now()}`)
      setAvatarMsg('✅ Foto atualizada!')
      setTimeout(() => { setAvatarMsg(''); router.refresh() }, 1500)
    } catch {
      setAvatarMsg('❌ Erro ao enviar imagem.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    router.push('/'); router.refresh()
  }

  if (!dataLoaded) return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 16px', minHeight: '100vh' }}>
      <div style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, textAlign: 'center', marginTop: '40px' }}>
        ⏳ Carregando...
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 16px', minHeight: '100vh' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: DS.typography.fontFamily.heading,
          fontSize: DS.typography.fontSize['5xl'],
          fontWeight: DS.typography.fontWeight.bold,
          color: DS.colors.text.primary,
          marginBottom: '4px', letterSpacing: '-0.5px',
        }}>
          ⚙️ Configurações
        </h1>
        <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '15px' }}>
          Gerencie sua conta e preferências
        </p>
      </div>

      {/* ── Foto de Perfil ── */}
      <Section title="Foto de Perfil">
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '20px', padding: '24px 0' }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              cursor: 'pointer', position: 'relative', flexShrink: 0,
              border: `3px solid ${DS.colors.primary.main}`,
              overflow: 'hidden', transition: DS.transitions.base,
            }}
            title="Clique para alterar foto"
            onMouseEnter={e => {
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
              if (overlay) { overlay.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)' }
            }}
            onMouseLeave={e => {
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
              if (overlay) { overlay.style.opacity = '0'; e.currentTarget.style.transform = 'scale(1)' }
            }}
          >
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl} alt="Avatar"
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                backgroundColor: DS.colors.primary.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '40px', fontWeight: DS.typography.fontWeight.bold,
                color: DS.colors.primary.main,
              }}>
                {displayName[0].toUpperCase()}
              </div>
            )}
            <div className="overlay" style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
              fontSize: '32px', pointerEvents: 'none',
            }}>
              📷
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: DS.typography.fontFamily.heading, color: DS.colors.text.primary, fontSize: '15px', marginBottom: '4px', fontWeight: DS.typography.fontWeight.semibold }}>
              {displayName}
            </p>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '12px', marginBottom: '4px' }}>
              Clique na foto para alterar
            </p>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.muted, fontSize: '12px' }}>
              JPG, PNG, WebP — máximo 2MB
            </p>
            {uploadingAvatar && (
              <p style={{ fontFamily: DS.typography.fontFamily.body, marginTop: '8px', fontSize: '13px', color: DS.colors.primary.main }}>
                ⏳ Enviando...
              </p>
            )}
            {avatarMsg && !uploadingAvatar && (
              <p style={{ fontFamily: DS.typography.fontFamily.body, marginTop: '8px', fontSize: '13px', color: avatarMsg.startsWith('✅') ? SUCCESS_COLOR : ERROR_COLOR }}>
                {avatarMsg}
              </p>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>
      </Section>

      {/* ── Conta ── */}
      <Section title="Conta">

        {/* Nome */}
        <div style={{ padding: '16px 0', borderBottom: `1px solid ${DS.colors.neutral.light}` }}>
          <label style={labelStyle}>Nome completo</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              placeholder="Ex: Seu Nome Completo"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = DS.colors.primary.main; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,61,46,0.10)' }}
              onBlur={e => { e.currentTarget.style.borderColor = DS.colors.neutral.medium; e.currentTarget.style.boxShadow = 'none' }}
            />
            <button
              onClick={handleSaveName}
              disabled={savingName || !fullName.trim()}
              style={{
                backgroundColor: fullName.trim() ? DS.colors.primary.main : DS.colors.neutral.medium,
                color: '#FFFFFF', border: 'none', borderRadius: DS.borderRadius.lg,
                padding: '10px 18px', fontFamily: DS.typography.fontFamily.body,
                fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold,
                cursor: savingName || !fullName.trim() ? 'not-allowed' : 'pointer',
                opacity: savingName || !fullName.trim() ? 0.7 : 1,
                transition: DS.transitions.fast, whiteSpace: 'nowrap' as const,
              }}
            >
              {savingName ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {nameMsg && (
            <p style={{ fontFamily: DS.typography.fontFamily.body, marginTop: '6px', fontSize: '13px', color: nameMsg.startsWith('✅') ? SUCCESS_COLOR : ERROR_COLOR }}>
              {nameMsg}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ padding: '16px 0', borderBottom: `1px solid ${DS.colors.neutral.light}` }}>
          <label style={labelStyle}>E-mail</label>
          <div style={{
            marginTop: '8px', backgroundColor: DS.colors.neutral.light,
            border: `1px solid ${DS.colors.neutral.medium}`,
            borderRadius: DS.borderRadius.md, padding: '10px 14px',
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary, fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            {email}
            <span style={{
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '11px', color: DS.colors.primary.main,
              backgroundColor: `${DS.colors.primary.main}15`,
              padding: '2px 8px', borderRadius: DS.borderRadius.full, flexShrink: 0,
            }}>
              Em breve
            </span>
          </div>
        </div>

        {/* Senha */}
        <div style={{ padding: '16px 0' }}>
          <label style={labelStyle}>Nova senha</label>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginTop: '8px' }}>
            <input
              type="password" value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              placeholder="Nova senha (mín. 6 caracteres)"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = DS.colors.primary.main; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,61,46,0.10)' }}
              onBlur={e => { e.currentTarget.style.borderColor = DS.colors.neutral.medium; e.currentTarget.style.boxShadow = 'none' }}
            />
            <button
              onClick={handleChangePwd}
              disabled={savingPwd || newPwd.length < 6}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: newPwd.length >= 6 ? DS.colors.primary.main : DS.colors.neutral.medium,
                color: '#FFFFFF', border: 'none', borderRadius: DS.borderRadius.lg,
                padding: '10px 18px', fontFamily: DS.typography.fontFamily.body,
                fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold,
                cursor: savingPwd || newPwd.length < 6 ? 'not-allowed' : 'pointer',
                opacity: savingPwd || newPwd.length < 6 ? 0.6 : 1,
                transition: DS.transitions.fast,
              }}
            >
              {savingPwd ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
          {pwdMsg && (
            <p style={{ fontFamily: DS.typography.fontFamily.body, marginTop: '6px', fontSize: '13px', color: pwdMsg.startsWith('✅') ? SUCCESS_COLOR : ERROR_COLOR }}>
              {pwdMsg}
            </p>
          )}
        </div>
      </Section>

      {/* ── Sessão ── */}
      <Section title="Sessão">
        <div style={{ padding: '16px 0' }}>
          <button
            onClick={handleSignOut} disabled={loggingOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              backgroundColor: 'transparent',
              border: `1.5px solid ${ERROR_COLOR}`,
              color: ERROR_COLOR, borderRadius: DS.borderRadius.lg,
              padding: '12px 20px', fontFamily: DS.typography.fontFamily.body,
              fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              opacity: loggingOut ? 0.6 : 1, transition: DS.transitions.fast,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${ERROR_COLOR}10`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            🚪 {loggingOut ? 'Saindo...' : 'Encerrar sessão'}
          </button>
        </div>
      </Section>

      {/* ── Zona de Perigo ── */}
      <Section title="Zona de Perigo">
        <div style={{ padding: '16px 0' }}>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: `${ERROR_COLOR}08`,
                border: `1.5px solid ${ERROR_COLOR}30`,
                color: ERROR_COLOR, borderRadius: DS.borderRadius.lg,
                padding: '12px 20px', fontFamily: DS.typography.fontFamily.body,
                fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
                cursor: 'pointer', transition: DS.transitions.fast,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${ERROR_COLOR}15`)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${ERROR_COLOR}08`)}
            >
              🗑️ Excluir minha conta
            </button>
          ) : (
            <div style={{
              backgroundColor: `${ERROR_COLOR}08`,
              border: `1px solid ${ERROR_COLOR}20`,
              borderRadius: DS.borderRadius.lg, padding: '20px',
            }}>
              <p style={{ fontFamily: DS.typography.fontFamily.heading, color: DS.colors.text.primary, fontWeight: DS.typography.fontWeight.semibold, marginBottom: '8px' }}>
                Tem certeza? Esta ação não pode ser desfeita.
              </p>
              <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '13px', marginBottom: '16px' }}>
                Todos os seus dados serão permanentemente removidos.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    backgroundColor: DS.colors.bg.primary,
                    border: `1.5px solid ${DS.colors.neutral.medium}`,
                    color: DS.colors.text.secondary,
                    borderRadius: DS.borderRadius.md, padding: '8px 16px',
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px', cursor: 'pointer', transition: DS.transitions.fast,
                  }}
                >
                  Cancelar
                </button>
                <button
                  disabled title="Em breve"
                  style={{
                    backgroundColor: ERROR_COLOR, color: '#FFFFFF', border: 'none',
                    borderRadius: DS.borderRadius.md, padding: '8px 16px',
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold,
                    cursor: 'not-allowed', opacity: 0.6,
                  }}
                >
                  Sim, excluir conta
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: DS.colors.bg.secondary,
      borderRadius: DS.borderRadius.lg, padding: '24px',
      marginBottom: '16px', border: `1px solid ${DS.colors.neutral.light}`,
      boxShadow: DS.shadows.sm,
    }}>
      <h2 style={{
        fontFamily: DS.typography.fontFamily.body,
        fontSize: '12px', fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.text.secondary,
        textTransform: 'uppercase' as const, letterSpacing: '0.8px', marginBottom: '16px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: DS.typography.fontFamily.body,
  color: DS.colors.text.secondary,
  fontSize: '12px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.5px',
}

const inputStyle: React.CSSProperties = {
  flex: 1, width: '100%',
  backgroundColor: DS.colors.bg.secondary,
  border: `1.5px solid ${DS.colors.neutral.medium}`,
  borderRadius: DS.borderRadius.md, padding: '10px 14px',
  fontFamily: DS.typography.fontFamily.body,
  color: DS.colors.text.primary, fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
}