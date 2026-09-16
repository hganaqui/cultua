import { Suspense } from 'react'
import { createServerSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Temas — CULTUA',
  description: 'Explore conteúdos por tema no CULTUA',
}

const DS = DESIGN_SYSTEM

async function TagsContent() {
  const supabase = await createServerSupabase()

  const { data: tags, error } = await supabase
    .from('tags').select('*, content_tags(count)').order('name')

  if (error || !tags) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px', fontFamily: DS.typography.fontFamily.body, color: DS.colors.text.secondary }}>
        Nenhum tema encontrado.
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {tags.map(tag => (
        <Link key={tag.id} href={`/tags/${tag.slug}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: DS.colors.bg.secondary,
              border: `1.5px solid ${DS.colors.neutral.light}`,
              borderRadius: DS.borderRadius.lg,
              padding: '20px',
              cursor: 'pointer',
              transition: DS.transitions.base,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: DS.shadows.sm,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = tag.color ?? DS.colors.primary.main
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = DS.shadows.md
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = DS.colors.neutral.light
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = DS.shadows.sm
            }}
          >
            <span style={{
              fontSize: '28px',
              flexShrink: 0,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${tag.color ?? DS.colors.primary.main}15`,
              borderRadius: DS.borderRadius.md,
            }}>
              {tag.icon ?? '🏷️'}
            </span>
            <div>
              <div style={{
                fontFamily: DS.typography.fontFamily.heading,
                fontSize: '14px',
                fontWeight: DS.typography.fontWeight.semibold,
                color: DS.colors.text.primary,
                marginBottom: '2px',
              }}>
                {tag.name}
              </div>
              <div style={{
                fontFamily: DS.typography.fontFamily.body,
                fontSize: '12px',
                color: DS.colors.text.muted,
              }}>
                Ver conteúdos →
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function Loading() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px',
      fontFamily: DS.typography.fontFamily.body,
      color: DS.colors.text.secondary,
    }}>
      Carregando temas...
    </div>
  )
}

export default function TagsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: DS.typography.fontFamily.heading,
            fontSize: DS.typography.fontSize['5xl'],
            fontWeight: DS.typography.fontWeight.bold,
            color: DS.colors.text.primary,
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}>
            🏷️ Temas
          </h1>
          <p style={{
            fontFamily: DS.typography.fontFamily.body,
            color: DS.colors.text.secondary,
            fontSize: DS.typography.fontSize.xl,
            margin: 0,
          }}>
            Explore conteúdos organizados por tema
          </p>
        </div>
        <Suspense fallback={<Loading />}>
          <TagsContent />
        </Suspense>
      </main>
    </div>
  )
}