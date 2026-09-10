// src/app/configuracoes/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { signOut } from '@/lib/auth'
import type { Metadata } from 'next'

// Configurações tem interatividade → 'use client'
// A proteção de rota já é feita pelo proxy.ts
export default function ConfiguracoesPage() {
  const router  = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loggingOut, setLoggingOut]       = useState(false)

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A1A', marginBottom: '4px' }}>
            ⚙️ Configurações
          </h1>
          <p style={{ color: '#666666', fontSize: '15px' }}>
            Gerencie sua conta e preferências
          </p>
        </div>

        {/* Seção: Conta */}
        <Section title="Conta">
          <SettingRow
            icon="✉️"
            label="Alterar e-mail"
            desc="Em breve"
            disabled
          />
          <SettingRow
            icon="🔑"
            label="Alterar senha"
            desc="Em breve"
            disabled
          />
          <SettingRow
            icon="👤"
            label="Editar nome"
            desc="Em breve"
            disabled
          />
        </Section>

        {/* Seção: Notificações */}
        <Section title="Notificações">
          <SettingRow
            icon="🔔"
            label="Notificações por e-mail"
            desc="Em breve"
            disabled
          />
        </Section>

        {/* Seção: Sessão */}
        <Section title="Sessão">
          <div style={{ padding: '16px 0' }}>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: 'transparent', border: '1.5px solid #EF4444',
                color: '#EF4444', borderRadius: '10px', padding: '12px 20px',
                fontSize: '15px', fontWeight: '600', cursor: loggingOut ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', opacity: loggingOut ? 0.6 : 1,
              }}
            >
              🚪 {loggingOut ? 'Saindo...' : 'Encerrar sessão'}
            </button>
          </div>
        </Section>

        {/* Seção: Zona de perigo */}
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
                <p style={{ color: '#1A1A1A', fontWeight: '600', marginBottom: '8px' }}>
                  Tem certeza? Esta ação não pode ser desfeita.
                </p>
                <p style={{ color: '#666666', fontSize: '13px', marginBottom: '16px' }}>
                  Todos os seus dados serão permanentemente removidos.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      backgroundColor: 'white', border: '1px solid #E0E0E0',
                      color: '#666666', borderRadius: '8px', padding: '8px 16px',
                      fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    disabled // funcional na Fase 2
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
      <Footer />
    </div>
  )
}

// ── Sub-componentes ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      padding: '24px', marginBottom: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    }}>
      <h2 style={{
        fontSize: '13px', fontWeight: '700', color: '#999999',
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function SettingRow({ icon, label, desc, disabled }: {
  icon: string; label: string; desc: string; disabled?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid #F5F5F5',
      opacity: disabled ? 0.5 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A' }}>{label}</div>
          <div style={{ fontSize: '12px', color: '#999999' }}>{desc}</div>
        </div>
      </div>
      <span style={{
        fontSize: '11px', color: '#B8860B', backgroundColor: 'rgba(184,134,11,0.1)',
        padding: '3px 10px', borderRadius: '9999px', fontWeight: '600',
      }}>
        Em breve
      </span>
    </div>
  )
}