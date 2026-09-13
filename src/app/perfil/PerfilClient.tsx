'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

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

      // ✅ NOVO: Buscar perfil do banco
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
  const avatarUrl   = profile?.avatar_url  // ✅ NOVO: Pega do perfil

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>

      <div style={{
        backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '40px',
        border: '1px solid #333333', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* ✅ NOVO: Avatar com imagem ou inicial */}
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
              }}
            />
          ) : (
            <div style={{
              width: '88px', height: '88px', backgroundColor: '#B8860B',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '32px', fontWeight: '900', color: '#111111', flexShrink: 0,
            }}>
              {initials}
            </div>
          )}
          
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>{displayName}</h1>
            <p style={{ color: '#CCCCCC', fontSize: '14px', marginBottom: '8px' }}>{user.email}</p>
            <span style={{
              backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E',
              fontSize: '12px', fontWeight: '600', padding: '4px 12px',
              borderRadius: '9999px', border: '1px solid rgba(34,197,94,0.3)',
            }}>
              ✅ Conta verificada
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2a2a2a', margin: '28px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { label: 'Membro desde', value: joinedAt },
            { label: 'Plano',        value: '🎵 Gratuito' },
            { label: 'Status',       value: '✅ Ativo' },
          ].map(item => (
            <div key={item.label} style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '16px', border: '1px solid #333333' }}>
              <div style={{ fontSize: '12px', color: '#666666', fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: '600' }}>{item.value}</div>
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
          <a key={item.href} href={item.href} style={{
            backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px',
            textDecoration: 'none', border: '1px solid #333333', display: 'block',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF' }}>{item.label}</div>
            <div style={{ fontSize: '12px', color: '#666666', marginTop: '2px' }}>{item.desc}</div>
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
        backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '40px',
        border: '1px solid #333333', textAlign: 'center', color: '#666666',
      }}>
        Carregando perfil...
      </div>
    </main>
  )
}