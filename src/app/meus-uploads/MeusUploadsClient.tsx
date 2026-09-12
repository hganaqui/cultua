// src/app/meus-uploads/MeusUploadsClient.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ContentWithStatus } from '@/types'

const STATUS_CONFIG = {
  pending:  { label: 'Em análise', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  icon: '⏳' },
  approved: { label: 'Aprovado',   color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   icon: '✅' },
  rejected: { label: 'Rejeitado',  color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   icon: '❌' },
} as const

export default function MeusUploadsClient({ contents }: { contents: ContentWithStatus[] }) {
  const counts = {
    pending:  contents.filter(c => c.status === 'pending').length,
    approved: contents.filter(c => c.status === 'approved').length,
    rejected: contents.filter(c => c.status === 'rejected').length,
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF' }}>
            📤 Meus Uploads
          </h1>
          <p style={{ color: '#666', fontSize: '15px', marginTop: '4px' }}>
            Acompanhe o status dos seus conteúdos
          </p>
        </div>
        <Link href="/admin/upload" style={{
          backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
          padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
        }}>
          + Novo Upload
        </Link>
      </div>

      {/* Cards de resumo */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px', marginBottom: '28px',
      }}>
        {(['pending', 'approved', 'rejected'] as const).map(s => {
          const cfg = STATUS_CONFIG[s]
          return (
            <div key={s} style={{
              backgroundColor: '#1a1a1a', border: `1px solid ${cfg.color}33`,
              borderRadius: '12px', padding: '20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cfg.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: cfg.color }}>
                {counts[s]}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {cfg.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista vazia */}
      {contents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Você ainda não enviou nenhum conteúdo.
          </p>
          <Link href="/admin/upload" style={{
            backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
            padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
          }}>
            Enviar primeiro conteúdo
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contents.map(item => {
            const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
              ?? STATUS_CONFIG.pending
            const categoryName = Array.isArray(item.category)
            ? (item.category[0]?.name ?? 'Sem categoria')
            : (item.category?.name ?? 'Sem categoria')

            return (
              <div key={item.id} style={{
                backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: '12px', padding: '16px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                {/* Thumbnail */}
                <div style={{
                  width: '80px', height: '52px', borderRadius: '8px',
                  backgroundColor: '#2a2a2a', flexShrink: 0, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.url_thumb ? (
                    <Image
                      src={item.url_thumb} alt={item.title}
                      width={80} height={52} style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px' }}>🎬</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: '#FFFFFF', fontWeight: '600', fontSize: '15px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{item.title}</p>
                  <p style={{ color: '#555', fontSize: '12px', marginTop: '3px' }}>
                    {categoryName} · {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Status badge */}
                <span style={{
                  flexShrink: 0, fontSize: '12px', fontWeight: '700',
                  color: cfg.color, backgroundColor: cfg.bg,
                  padding: '5px 14px', borderRadius: '9999px',
                  border: `1px solid ${cfg.color}44`,
                }}>
                  {cfg.icon} {cfg.label}
                </span>

                {/* Link ver (só aprovado) */}
                {item.status === 'approved' && (
                  <Link href={`/content/${item.id}`} style={{
                    flexShrink: 0, color: '#B8860B', fontSize: '13px',
                    textDecoration: 'none', fontWeight: '700',
                  }}>
                    Ver →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}