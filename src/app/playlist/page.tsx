// src/app/playlist/page.tsx
import { getServerUser } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Minhas Playlists' }

export default async function PlaylistPage() {
  const user = await getServerUser()
  if (!user) redirect('/auth/login?redirect=/playlist')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Cabeçalho */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A1A', marginBottom: '4px' }}>
              🎵 Minhas Playlists
            </h1>
            <p style={{ color: '#666666', fontSize: '15px' }}>
              Organize seu conteúdo favorito
            </p>
          </div>

          {/* Botão criar — funcional na Fase 2 */}
          <button
            disabled
            title="Em breve"
            style={{
              backgroundColor: '#B8860B', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
              fontWeight: '700', cursor: 'not-allowed', opacity: 0.7,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            + Nova Playlist
          </button>
        </div>

        {/* Estado vazio */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '64px 32px', textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎶</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>
            Nenhuma playlist criada ainda
          </h2>
          <p style={{ color: '#999999', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>
            Em breve você poderá criar playlists personalizadas
            com pregações, louvores e devocionais.
          </p>
          <span style={{
            display: 'inline-block', marginTop: '16px',
            backgroundColor: 'rgba(184,134,11,0.1)', color: '#B8860B',
            fontSize: '12px', fontWeight: '600', padding: '6px 16px',
            borderRadius: '9999px', border: '1px solid rgba(184,134,11,0.2)',
          }}>
            🚀 Disponível em breve
          </span>
        </div>

      </main>
      <Footer />
    </div>
  )
}