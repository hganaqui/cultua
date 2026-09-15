'use client'

import Link from 'next/link'
import Image from 'next/image'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { ContentWithStatus } from '@/types'
import { getCategory } from '@/types'

const DS = DESIGN_SYSTEM

const STATUS_CONFIG = {
  pending:  { label: 'Em análise', color: DS.colors.primary.accent, bg: DS.colors.primary.accent + '15', icon: '⏳' },
  approved: { label: 'Aprovado',   color: DS.colors.secondary.success, bg: DS.colors.secondary.success + '15', icon: '✅' },
  rejected: { label: 'Rejeitado',  color: DS.colors.secondary.error, bg: DS.colors.secondary.error + '15', icon: '❌' },
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
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between', 
          marginBottom: '32px',
          flexWrap: 'wrap', 
          gap: '12px',
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '800', 
              color: DS.colors.text.dark, 
              marginBottom: '4px' 
            }}>
              📤 Meus Uploads
            </h1>
            <p style={{ color: DS.colors.text.secondary, fontSize: '15px' }}>
              Acompanhe o status dos seus conteúdos
            </p>
          </div>
          <Link href="/admin/upload" style={{
            backgroundColor: DS.colors.primary.main, 
            color: 'white', 
            textDecoration: 'none',
            padding: '10px 20px', 
            borderRadius: DS.borderRadius.md, 
            fontSize: '14px', 
            fontWeight: '700',
            transition: DS.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.light
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = DS.colors.primary.main
          }}
          >
            + Novo Upload
          </Link>
        </div>

        {/* Cards de resumo */}
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px', 
          marginBottom: '28px',
        }}>
          {(['pending', 'approved', 'rejected'] as const).map(s => {
            const cfg = STATUS_CONFIG[s]
            return (
              <div key={s} style={{
                backgroundColor: DS.colors.bg.secondary,
                border: `2px solid ${cfg.color}`,
                borderRadius: DS.borderRadius.lg, 
                padding: '20px', 
                textAlign: 'center',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = DS.shadows.lg
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cfg.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: cfg.color }}>
                  {counts[s]}
                </div>
                <div style={{ fontSize: '12px', color: DS.colors.text.secondary, marginTop: '2px' }}>
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
            padding: '60px 32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px', color: DS.colors.text.secondary, marginBottom: '20px' }}>
              Você ainda não enviou nenhum conteúdo.
            </p>
            <Link href="/admin/upload" style={{
              backgroundColor: DS.colors.primary.main, 
              color: 'white', 
              textDecoration: 'none',
              padding: '12px 28px', 
              borderRadius: DS.borderRadius.md,
              fontSize: '15px', 
              fontWeight: '700', 
              display: 'inline-block',
              transition: DS.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = DS.colors.primary.light
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = DS.colors.primary.main
            }}
            >
              Enviar primeiro conteúdo
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contents.map(item => {
              const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
                ?? STATUS_CONFIG.pending
              const cat = getCategory(item.category)

              return (
                <div key={item.id} style={{
                  backgroundColor: DS.colors.bg.secondary,
                  border: `1px solid ${DS.colors.neutral.light}`,
                  borderRadius: DS.borderRadius.md, 
                  padding: '16px',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  transition: DS.transitions.base,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.primary.main
                  e.currentTarget.style.boxShadow = DS.shadows.md
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DS.colors.neutral.light
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '80px', 
                    height: '52px', 
                    borderRadius: DS.borderRadius.md,
                    backgroundColor: DS.colors.neutral.charcoal, 
                    flexShrink: 0, 
                    overflow: 'hidden',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    {item.url_thumb ? (
                      <Image
                        src={item.url_thumb} 
                        alt={item.title}
                        width={80} 
                        height={52}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px' }}>🎬</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: DS.colors.text.dark, 
                      fontWeight: '600', 
                      fontSize: '15px',
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      marginBottom: '4px',
                    }}>
                      {item.title}
                    </p>
                    <p style={{ color: DS.colors.text.secondary, fontSize: '12px' }}>
                      {cat?.name ?? 'Sem categoria'} · {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span style={{
                    flexShrink: 0, 
                    fontSize: '12px', 
                    fontWeight: '700',
                    color: cfg.color, 
                    backgroundColor: cfg.bg,
                    padding: '5px 14px', 
                    borderRadius: DS.borderRadius.full,
                    border: `1px solid ${cfg.color}44`,
                    whiteSpace: 'nowrap',
                  }}>
                    {cfg.icon} {cfg.label}
                  </span>

                  {/* Link ver (só aprovado) */}
                  {item.status === 'approved' && (
                    <Link href={`/content/${item.id}`} style={{
                      flexShrink: 0, 
                      color: DS.colors.primary.main, 
                      fontSize: '13px',
                      textDecoration: 'none', 
                      fontWeight: '700',
                      transition: DS.transitions.base,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = DS.colors.primary.light
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = DS.colors.primary.main
                    }}
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