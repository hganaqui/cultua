// src/app/configuracoes/ConfiguracoesClient.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { createBrowserClient } from '@supabase/ssr'
import type { Profile } from '@/types'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  profile: Profile
  email: string
}

export default function ConfiguracoesClient({ profile, email }: Props) {
  const router = useRouter()

  const [fullName, setFullName]   = useState(profile.full_name ?? '')
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg]     = useState('')

  const [newPwd, setNewPwd]       = useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg]       = useState('')

  const [avatarUrl, setAvatarUrl]           = useState(profile.avatar_url ?? '')
  const [imgError, setImgError]             = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarMsg, setAvatarMsg]           = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [loggingOut, setLoggingOut]         = useState(false)
  const [confirmDelete, setConfirmDelete]   = useState(false)

  const displayName = fullName.split(' ')[0] || email.split('@')[0] || 'Usuário'

  // ── Salvar nome ──────────────────────────────────────────────────────────
  async function handleSaveName() {
    if (!fullName.trim()) return
    setSavingName(true)
    setNameMsg('')
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', profile.id)
    setSavingName(false)
    if (error) { setNameMsg('❌ Erro ao salvar nome.'); return }
    setNameMsg('✅ Nome atualizado!')
    router.refresh()
    setTimeout(() => setNameMsg(''), 3000)
  }

  // ── Alterar senha ────────────────────────────────────────────────────────
  async function handleChangePwd() {
    if (newPwd.length < 6) { setPwdMsg('❌ Mínimo 6 caracteres.'); return }
    setSavingPwd(true)
    setPwdMsg('')
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setSavingPwd(false)
    if (error) { setPwdMsg('❌ ' + error.message); return }
    setPwdMsg('✅ Senha alterada com sucesso!')
    setNewPwd('')
    setTimeout(() => setPwdMsg(''), 4000)
  }

  // ── Upload avatar ────────────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setAvatarMsg('❌ Selecione uma imagem.'); return }
    if (file.size > 2 * 1024 * 1024)    { setAvatarMsg('❌ Máximo 2MB.'); return }

    setUploadingAvatar(true)
    setAvatarMsg('')
    const formData = new FormData()
    formData.append('avatar', file)

    const res  = await fetch('/api/upload-avatar', { method: 'POST', body: formData })
    const data = await res.json()
    setUploadingAvatar(false)

    if (!res.ok) { setAvatarMsg('❌ ' + (data.error ?? 'Erro ao enviar.')); return }

    // ✅ reset imgError para tentar carregar a nova imagem
    setImgError(false)
    setAvatarUrl(data.url + '?t=' + Date.now()) // cache bust
    setAvatarMsg('✅ Foto atualizada!')
    setTimeout(() => {
      setAvatarMsg('')
      router.refresh()
    }, 1500)
  }

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
          ⚙️ Configurações
        </h1>
        <p style={{ color: '#666666', fontSize: '15px' }}>Gerencie sua conta e preferências</p>
      </div>

      {/* ── Foto de Perfil ─────────────────────────────────────────── */}
      <Section title="Foto de Perfil">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 0' }}>

          {/* Preview — ✅ <img> nativo com onError, sem next/image */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              cursor: 'pointer', position: 'relative', flexShrink: 0,
              border: '2px dashed #B8860B', overflow: 'hidden',
            }}
            title="Clique para alterar foto"
            onMouseEnter={e => {
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
              if (overlay) overlay.style.opacity = '1'
            }}
            onMouseLeave={e => {
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
              if (overlay) overlay.style.opacity = '0'
            }}
          >
            {/* ✅ img nativo — sem 400 do next/image */}
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                onError={() => setImgError(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%', backgroundColor: '#B8860B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: '700', color: 'white',
              }}>
                {displayName[0].toUpperCase()}
              </div>
            )}

            {/* Overlay câmera */}
            <div className="overlay" style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s', fontSize: '22px',
              pointerEvents: 'none',
            }}>
              📷
            </div>
          </div>

          <div>
            <p style={{ color: '#CCCCCC', fontSize: '14px', marginBottom: '8px' }}>
              Clique na foto para alterar
            </p>
            <p style={{ color: '#666666', fontSize: '12px' }}>JPG, PNG, WebP — máximo 2MB</p>
            {uploadingAvatar && (
              <p style={{ marginTop: '8px', fontSize: '13px', color: '#B8860B' }}>
                ⏳ Enviando...
              </p>
            )}
            {avatarMsg && !uploadingAvatar && (
              <p style={{
                marginTop: '8px', fontSize: '13px',
                color: avatarMsg.startsWith('✅') ? '#22C55E' : '#EF4444',
              }}>
                {avatarMsg}
              </p>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
      </Section>

      {/* ── Conta ──────────────────────────────────────────────────── */}
      <Section title="Conta">

        {/* Nome */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
          <label style={{
            color: '#999999', fontSize: '12px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Nome completo
          </label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              placeholder="Seu nome"
              style={{
                flex: 1, backgroundColor: '#111111', border: '1px solid #333333',
                borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF',
                fontSize: '14px', outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
              onBlur={e => (e.currentTarget.style.borderColor = '#333333')}
            />
            <button
              onClick={handleSaveName}
              disabled={savingName || !fullName.trim()}
              style={{
                backgroundColor: fullName.trim() ? '#B8860B' : '#333333',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '10px 18px', fontSize: '14px', fontWeight: '600',
                cursor: (savingName || !fullName.trim()) ? 'not-allowed' : 'pointer',
                opacity: (savingName || !fullName.trim()) ? 0.7 : 1,
                transition: 'all 0.15s',
              }}
            >
              {savingName ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {nameMsg && (
            <p style={{
              marginTop: '6px', fontSize: '13px',
              color: nameMsg.startsWith('✅') ? '#22C55E' : '#EF4444',
            }}>
              {nameMsg}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
          <label style={{
            color: '#999999', fontSize: '12px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            E-mail
          </label>
          <div style={{
            marginTop: '8px', backgroundColor: '#111111', border: '1px solid #2a2a2a',
            borderRadius: '8px', padding: '10px 14px', color: '#555555',
            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            {email}
            <span style={{
              fontSize: '11px', color: '#B8860B',
              backgroundColor: 'rgba(184,134,11,0.1)',
              padding: '2px 8px', borderRadius: '9999px', flexShrink: 0,
            }}>
              Em breve
            </span>
          </div>
        </div>

        {/* Nova senha */}
        <div style={{ padding: '16px 0' }}>
          <label style={{
            color: '#999999', fontSize: '12px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Nova senha
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <input
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              placeholder="Nova senha (mín. 6 caracteres)"
              style={{
                backgroundColor: '#111111', border: '1px solid #333333',
                borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF',
                fontSize: '14px', outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
              onBlur={e => (e.currentTarget.style.borderColor = '#333333')}
            />
            <button
              onClick={handleChangePwd}
              disabled={savingPwd || newPwd.length < 6}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: newPwd.length >= 6 ? '#B8860B' : '#333333',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '10px 18px', fontSize: '14px', fontWeight: '600',
                cursor: (savingPwd || newPwd.length < 6) ? 'not-allowed' : 'pointer',
                opacity: (savingPwd || newPwd.length < 6) ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
            >
              {savingPwd ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
          {pwdMsg && (
            <p style={{
              marginTop: '6px', fontSize: '13px',
              color: pwdMsg.startsWith('✅') ? '#22C55E' : '#EF4444',
            }}>
              {pwdMsg}
            </p>
          )}
        </div>
      </Section>

      {/* ── Sessão ─────────────────────────────────────────────────── */}
      <Section title="Sessão">
        <div style={{ padding: '16px 0' }}>
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              backgroundColor: 'transparent', border: '1.5px solid #EF4444',
              color: '#EF4444', borderRadius: '10px', padding: '12px 20px',
              fontSize: '15px', fontWeight: '600',
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              opacity: loggingOut ? 0.6 : 1, transition: 'opacity 0.2s',
            }}
          >
            🚪 {loggingOut ? 'Saindo...' : 'Encerrar sessão'}
          </button>
        </div>
      </Section>

      {/* ── Zona de Perigo ──────────────────────────────────────────── */}
      <Section title="Zona de Perigo">
        <div style={{ padding: '16px 0' }}>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: 'rgba(239,68,68,0.05)',
                border: '1.5px solid rgba(239,68,68,0.3)',
                color: '#EF4444', borderRadius: '10px', padding: '12px 20px',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              🗑️ Excluir minha conta
            </button>
          ) : (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px', padding: '20px',
            }}>
              <p style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>
                Tem certeza? Esta ação não pode ser desfeita.
              </p>
              <p style={{ color: '#666666', fontSize: '13px', marginBottom: '16px' }}>
                Todos os seus dados serão permanentemente removidos.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    backgroundColor: '#2a2a2a', border: '1px solid #444444',
                    color: '#CCCCCC', borderRadius: '8px', padding: '8px 16px',
                    fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  disabled
                  title="Em breve"
                  style={{
                    backgroundColor: '#EF4444', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '8px 16px', fontSize: '14px',
                    fontWeight: '600', cursor: 'not-allowed', opacity: 0.6,
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

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '24px',
      marginBottom: '16px', border: '1px solid #2a2a2a',
    }}>
      <h2 style={{
        fontSize: '13px', fontWeight: '700', color: '#666666',
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}