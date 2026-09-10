// src/app/historico/page.tsx
import { getServerUser } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Histórico' }

export default async function HistoricoPage() {
  const user = await getServerUser()
  if (!user) redirect('/auth/login?redirect=/historico')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A1A', marginBottom: '4px' }}>
            📺 Histórico
          </h1>
          <p style={{ color: '#666666', fontSize: '15px' }}>
            Conteúdos que você assistiu recentemente
          </p>
        </div>

        {/* Estado vazio — será substituído por dados reais na Fase 2 */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '64px 32px', textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>
            Nenhum conteúdo assistido ainda
          </h2>
          <p style={{ color: '#999999', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
            Quando você assistir pregações, louvores ou devocionais,<br />
            eles aparecerão aqui.
          </p>
          <a href="/" style={{
            backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
            padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
          }}>
            🎵 Explorar Conteúdo
          </a>
        </div>

      </main>
      <Footer />
    </div>
  )
}