'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

const DS = DESIGN_SYSTEM

export default function PerfilClient() {
  const router = useRouter()
  const [user, setUser]         = useState<User | null>(null)
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [loading, setLoading]   = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/auth/login?redirect=/perfil')
        return
      }
      setUser(data.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      setLoading(false)
    })
  }, [router])

  if (loading) return <LoadingState />
  if (!user)   return null

  const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Usuário'
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const joinedAt    = new Date(user.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
  const avatarUrl   = profile?.avatar_url

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>

      <div style={{
        backgroundColor: DS.colors.bg.secondary, 
        borderRadius: DS.borderRadius.xl, 
        padding: '40px',
        border: `1px solid ${DS.colors.neutral.light}`, 
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl + `?t=${Date.now()}`}
              alt={displayName}
              onError={() => setImgError(true)}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                border: `3px solid ${DS.colors.primary.main}`,
              }}
            />
          ) : (
            <div style={{
              width: '88px', 
              height: '88px', 
              backgroundColor: DS.colors.primary.main,
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center', 
              fontSize: '32px', 
              fontWeight: '900', 
              color: 'white', 
              flexShrink: 0,
              border: `3px solid ${DS.colors.primary.light}`,
            }}>
              {initials}
            </div>
          )}
          
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: DS.colors.text.dark, marginBottom: '4px' }}>
              {displayName}
            </h1>
            <p style={{ color: DS.colors.text.secondary, fontSize: '14px', marginBottom: '8px' }}>
              {user.email}
            </p>
            <span style={{
              backgroundColor: DS.colors.secondary.success + '15', 
              color: DS.colors.secondary.success,
              fontSize: '12px', 
              fontWeight: '600', 
              padding: '4px 12px',
              borderRadius: DS.borderRadius.full, 
              border: `1px solid ${DS.colors.secondary.success}30`,
            }}>
              ✅ Conta verificada
            </span>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${DS.colors.neutral.light}`, margin: '28px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { label: 'Membro desde', value: joinedAt },
            { label: 'Plano',        value: '🎵 Gratuito' },
            { label: 'Status',       value: '✅ Ativo' },
          ].map(item => (
            <div key={item.label} style={{ 
              backgroundColor: DS.colors.neutral.charcoal + '40', 
              borderRadius: DS.borderRadius.lg, 
              padding: '16px', 
              border: `1px solid ${DS.colors.neutral.light}` 
            }}>
              <div style={{ fontSize: '12px', color: DS.colors.text.secondary, fontWeight: '600', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '15px', color: DS.colors.text.dark, fontWeight: '600' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { href: '/historico',     icon: '📺', label: 'Histórico',     desc: 'O que você assistiu' },
          { href: '/playlist',      icon: '🎵', label: 'Playlists',     desc: 'Suas coleções' },
          { href: '/configuracoes', icon: '⚙️', label: 'Configurações', desc: 'Editar sua conta' },
        ].map(item => (
          <a 
            key={item.href} 
            href={item.href} 
            style={{
              backgroundColor: DS.colors.bg.secondary, 
              borderRadius: DS.borderRadius.lg, 
              padding: '20px',
              textDecoration: 'none', 
              border: `1px solid ${DS.colors.neutral.light}`, 
              display: 'block',
              transition: DS.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = DS.colors.primary.main
              e.currentTarget.style.backgroundColor = DS.colors.neutral.charcoal + '40'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = DS.colors.neutral.light
              e.currentTarget.style.backgroundColor = DS.colors.bg.secondary
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>
              {item.icon}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: DS.colors.text.dark }}>
              {item.label}
            </div>
            <div style={{ fontSize: '12px', color: DS.colors.text.secondary, marginTop: '2px' }}>
              {item.desc}
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}

function LoadingState() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary, 
        borderRadius: DS.borderRadius.xl, 
        padding: '40px',
        border: `1px solid ${DS.colors.neutral.light}`, 
        textAlign: 'center', 
        color: DS.colors.text.secondary,
      }}>
        Carregando perfil...
      </div>
    </main>
  )
}