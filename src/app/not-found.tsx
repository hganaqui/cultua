'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function NotFound() {
  const [hoveredBtn, setHoveredBtn] = useState<'home' | null>(null)

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex', flexDirection: 'column' as const,
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center',
      fontFamily: DS.typography.fontFamily.body,
    }}>
      {/* Imagem 404 */}
      <div style={{ marginBottom: '32px', maxWidth: '240px' }}>
        <img
          src="/404-not-found.jpg"
          alt="Conteúdo não encontrado"
          style={{ width: '100%', height: 'auto', borderRadius: DS.borderRadius.lg }}
        />
      </div>

      {/* Título */}
      <h1 style={{
        fontFamily: DS.typography.fontFamily.heading,
        fontSize: DS.typography.fontSize['4xl'],
        fontWeight: DS.typography.fontWeight.bold,
        color: DS.colors.text.primary,
        marginBottom: DS.spacing.lg,
      }}>
        Página não encontrada
      </h1>

      {/* Subtítulo */}
      <p style={{
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
        fontSize: DS.typography.fontSize.base,
        maxWidth: '448px', lineHeight: DS.typography.lineHeight.relaxed,
        marginBottom: '40px',
      }}>
        O conteúdo que você procura pode ter sido removido ou o endereço está incorreto.
      </p>

      {/* Versículo */}
      <blockquote style={{
        borderLeft: `4px solid ${DS.colors.primary.main}`,
        paddingLeft: DS.spacing.lg,
        marginBottom: '48px',
        maxWidth: '448px', textAlign: 'left',
      }}>
        <p style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.text.secondary, fontStyle: 'italic',
          marginBottom: DS.spacing.md,
          fontSize: DS.typography.fontSize.sm,
          lineHeight: DS.typography.lineHeight.relaxed,
        }}>
          "Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar
          e não de causar dano, planos de dar a vocês esperança e um futuro."
        </p>
        <cite style={{
          fontFamily: DS.typography.fontFamily.body,
          color: DS.colors.primary.main,
          fontSize: DS.typography.fontSize.xs,
          fontWeight: DS.typography.fontWeight.bold,
          fontStyle: 'normal',
        }}>
          Jeremias 29:11
        </cite>
      </blockquote>

      {/* CTA */}
      <Link
        href="/"
        style={{
          padding: `${DS.spacing.md} ${DS.spacing.xl}`,
          borderRadius: DS.borderRadius.lg,
          fontFamily: DS.typography.fontFamily.body,
          fontWeight: DS.typography.fontWeight.semibold,
          fontSize: DS.typography.fontSize.base,
          transition: DS.transitions.fast,
          backgroundColor: hoveredBtn === 'home' ? DS.colors.primary.light : DS.colors.primary.main,
          color: '#FFFFFF',
          textDecoration: 'none', display: 'inline-block',
          boxShadow: '0 4px 16px rgba(15,61,46,0.2)',
        }}
        onMouseEnter={() => setHoveredBtn('home')}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        🏠 Voltar ao Início
      </Link>
    </main>
  )
}