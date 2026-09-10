// src/app/perfil/page.tsx
import { getServerUser } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meu Perfil' }

export default async function PerfilPage() {
  const user = await getServerUser()
  if (!user) redirect('/auth/login?redirect=/perfil')

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Usuário'
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const joinedAt    = new Date(user.created_at).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Card principal */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{
              width: '88px', height: '88px', backgroundColor: '#B8860B',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '32px', fontWeight: '900',
              color: 'white', flexShrink: 0,
            }}>
              {initials}
            </div>

            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1A1A1A', marginBottom: '4px' }}>
                {displayName}
              </h1>
              <p style={{ color: '#666666', fontSize: '14px', marginBottom: '8px' }}>
                {user.email}
              </p>
              <span style={{
                backgroundColor: 'rgba(184,134,11,0.1)', color: '#B8860B',
                fontSize: '12px', fontWeight: '600', padding: '4px 12px',
                borderRadius: '9999px', border: '1px solid rgba(184,134,11,0.2)',
              }}>
                ✅ Conta verificada
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #F0F0F0', margin: '28px 0' }} />

          {/* Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Membro desde',  value: joinedAt },
              { label: 'Plano',         value: '🎵 Gratuito' },
              { label: 'Status',        value: '✅ Ativo' },
            ].map(item => (
              <div key={item.label} style={{
                backgroundColor: '#F9F9F9', borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ fontSize: '12px', color: '#999999', fontWeight: '600', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: '600' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { href: '/historico',     icon: '📺', label: 'Histórico',        desc: 'O que você assistiu' },
            { href: '/playlist',      icon: '🎵', label: 'Playlists',        desc: 'Suas coleções' },
            { href: '/configuracoes', icon: '⚙️', label: 'Configurações',    desc: 'Editar sua conta' },
          ].map(item => (
            <a key={item.href} href={item.href} style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '20px',
              textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: '2px solid transparent', transition: 'all 0.2s', display: 'block',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#B8860B')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A1A' }}>{item.label}</div>
              <div style={{ fontSize: '12px', color: '#999999', marginTop: '2px' }}>{item.desc}</div>
            </a>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  )
}