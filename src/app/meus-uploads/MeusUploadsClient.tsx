'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { ContentWithStatus } from '@/types'
import { getCategory } from '@/types'

const DS = DESIGN_SYSTEM

const SUCCESS_COLOR = '#6B7F6B'
const ERROR_COLOR   = '#C84C3C'

const STATUS_CONFIG = {
  pending:  { label: 'Em análise', color: DS.colors.primary.accent,  bg: `${DS.colors.primary.accent}15`,  icon: '⏳' },
  approved: { label: 'Aprovado',   color: SUCCESS_COLOR,             bg: `${SUCCESS_COLOR}15`,             icon: '✅' },
  rejected: { label: 'Rejeitado',  color: ERROR_COLOR,               bg: `${ERROR_COLOR}15`,               icon: '❌' },
} as const

export default function MeusUploadsClient({ contents }: { contents: ContentWithStatus[] }) {
  const counts = {
    pending:  contents.filter(c => c.status === 'pending').length,
    approved: contents.filter(c => c.status === 'approved').length,
    rejected: contents.filter(c => c.status === 'rejected').length,
  }

  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: DS.colors.bg.primary,
      padding: '40px 16px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '32px',
          flexWrap: 'wrap' as const, gap: '12px',
        }}>
          <div>
            <h1 style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: DS.typography.fontSize['5xl'],
              fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.text.primary,
              marginBottom: '4px', letterSpacing: '-0.5px',
            }}>
              📤 Meus Uploads
            </h1>
            <p style={{ fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary, fontSize: '15px' }}>
              Acompanhe o status dos seus conteúdos
            </p>
          </div>
          <Link
            href="/admin/upload"
            style={{
              backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
              textDecoration: 'none', padding: '10px 20px',
              borderRadius: DS.borderRadius.lg,
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '14px', fontWeight: DS.typography.fontWeight.semibold,
              boxShadow: '0 4px 16px rgba(15,61,46,0.2)',
              transition: DS.transitions.fast,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
          >
            + Novo Upload
          </Link>
        </div>

        {/* Cards de resumo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px', marginBottom: '28px',
        }}>
          {(['pending', 'approved', 'rejected'] as const).map(s => {
            const cfg = STATUS_CONFIG[s]
            return (
              <div
                key={s}
                style={{
                  backgroundColor: DS.colors.bg.secondary,
                  border: `2px solid ${cfg.color}`,
                  borderRadius: DS.borderRadius.lg,
                  padding: '20px', textAlign: 'center',
                  transition: DS.transitions.base,
                  boxShadow: DS.shadows.sm,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = DS.shadows.lg
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = DS.shadows.sm
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cfg.icon}</div>
                <div style={{
                  fontFamily: DS.typography.fontFamily.heading,
                  fontSize: '28px', fontWeight: DS.typography.fontWeight.bold, color: cfg.color,
                }}>
                  {counts[s]}
                </div>
                <div style={{
                  fontFamily: DS.typography.fontFamily.body,
                  fontSize: '12px', color: DS.colors.text.secondary, marginTop: '2px',
                }}>
                  {cfg.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista vazia */}
        {contents.length === 0 ? (
          <div style={{
            backgroundColor: DS.colors.bg.secondary,
            border: `1px solid ${DS.colors.neutral.light}`,
            borderRadius: DS.borderRadius.xl,
            padding: '60px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{
              fontFamily: DS.typography.fontFamily.body,
              fontSize: '16px', color: DS.colors.text.secondary, marginBottom: '20px',
            }}>
              Você ainda não enviou nenhum conteúdo.
            </p>
            <Link
              href="/admin/upload"
              style={{
                backgroundColor: DS.colors.primary.main, color: '#FFFFFF',
                textDecoration: 'none', padding: '12px 28px',
                borderRadius: DS.borderRadius.lg, fontFamily: DS.typography.fontFamily.body,
                fontSize: '15px', fontWeight: DS.typography.fontWeight.semibold,
                display: 'inline-block', transition: DS.transitions.fast,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.light)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = DS.colors.primary.main)}
            >
              Enviar primeiro conteúdo
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {contents.map(item => {
              const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
              const cat = getCategory(item.category)

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: DS.colors.bg.secondary,
                    border: `1px solid ${DS.colors.neutral.light}`,
                    borderRadius: DS.borderRadius.lg, padding: '16px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    transition: DS.transitions.fast,
                    boxShadow: DS.shadows.sm,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = DS.colors.primary.main
                    el.style.boxShadow = DS.shadows.md
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = DS.colors.neutral.light
                    el.style.boxShadow = DS.shadows.sm
                  }}
                >
                  {/* Thumbnail — sem next/image, usa <img> nativo conforme padrão CULTUA */}
                  <div style={{
                    width: '80px', height: '52px',
                    borderRadius: DS.borderRadius.md,
                    backgroundColor: DS.colors.neutral.light,
                    flexShrink: 0, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.url_thumb ? (
                      <img
                        src={item.url_thumb}
                        alt={item.title}
                        style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px' }}>🎬</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: DS.typography.fontFamily.heading,
                      color: DS.colors.text.primary,
                      fontWeight: DS.typography.fontWeight.semibold,
                      fontSize: '15px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                      marginBottom: '4px',
                    }}>
                      {item.title}
                    </p>
                    <p style={{
                      fontFamily: DS.typography.fontFamily.body,
                      color: DS.colors.text.secondary, fontSize: '12px',
                    }}>
                      {cat?.name ?? 'Sem categoria'} · {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span style={{
                    flexShrink: 0,
                    fontFamily: DS.typography.fontFamily.body,
                    fontSize: '12px', fontWeight: DS.typography.fontWeight.semibold,
                    color: cfg.color, backgroundColor: cfg.bg,
                    padding: '5px 14px', borderRadius: DS.borderRadius.full,
                    border: `1px solid ${cfg.color}44`,
                    whiteSpace: 'nowrap' as const,
                  }}>
                    {cfg.icon} {cfg.label}
                  </span>

                  {/* Link ver — só aprovado */}
                  {item.status === 'approved' && (
                    <Link
                      href={`/content/${item.id}`}
                      style={{
                        flexShrink: 0, color: DS.colors.primary.main,
                        fontFamily: DS.typography.fontFamily.body,
                        fontSize: '13px', textDecoration: 'none',
                        fontWeight: DS.typography.fontWeight.semibold,
                        transition: DS.transitions.fast,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = DS.colors.primary.light)}
                      onMouseLeave={e => (e.currentTarget.style.color = DS.colors.primary.main)}
                    >
                      Ver →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}