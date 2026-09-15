'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function NotFound() {
  const [hoveredBtn, setHoveredBtn] = useState<'home' | 'explorar' | null>(null)

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      color: DS.colors.text.light,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      fontFamily: DS.typography.fontFamily.main,
    }}>
      {/* Imagem 404 */}
      <div style={{ marginBottom: '32px', maxWidth: '240px' }}>
        <img
          src="/404-not-found.jpg"
          alt="Conteúdo não encontrado"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '16px',
          }}
        />
      </div>

      {/* Heading */}
      <h1 style={{
        fontSize: DS.typography.fontSize['4xl'],
        fontWeight: DS.typography.fontWeight.extrabold,
        color: DS.colors.text.dark,
        marginBottom: DS.spacing.lg,
      }}>
        Página não encontrada
      </h1>

      {/* Subtítulo */}
      <p style={{
        color: DS.colors.text.secondary,
        fontSize: DS.typography.fontSize.base,
        maxWidth: '448px',
        lineHeight: DS.typography.lineHeight.relaxed,
        marginBottom: '40px',
      }}>
        O conteúdo que você procura pode ter sido removido ou o endereço está incorreto ou página inexistente.
      </p>

      {/* Versículo */}
      <blockquote style={{
        borderLeft: `4px solid ${DS.colors.primary.main}`,
        paddingLeft: DS.spacing.lg,
        marginBottom: '48px',
        maxWidth: '448px',
        textAlign: 'left',
      }}>
        <p style={{
          color: DS.colors.text.secondary,
          fontStyle: 'italic',
          marginBottom: DS.spacing.md,
          fontSize: DS.typography.fontSize.sm,
          lineHeight: DS.typography.lineHeight.relaxed,
        }}>
          "Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro."
        </p>
        <cite style={{
          color: DS.colors.primary.main,
          fontSize: DS.typography.fontSize.xs,
          fontWeight: DS.typography.fontWeight.bold,
          fontStyle: 'normal',
        }}>
          Jeremias 29:11
        </cite>
      </blockquote>

      {/* Ações */}
      <div style={{
        display: 'flex',
        gap: DS.spacing.lg,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <Link
          href="/"
          style={{
            padding: `${DS.spacing.md} ${DS.spacing.xl}`,
            borderRadius: DS.borderRadius.md,
            fontWeight: DS.typography.fontWeight.bold,
            fontSize: DS.typography.fontSize.base,
            transition: DS.transitions.base,
            backgroundColor: hoveredBtn === 'home' ? `${DS.colors.primary.main}CC` : DS.colors.primary.main,
            color: '#FFFFFF',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          onMouseEnter={() => setHoveredBtn('home')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🏠 Voltar ao Início
        </Link>

        {/* ✅ NOVO: Segundo botão no padrão */}
        <Link
          href="/"
          style={{
            padding: `${DS.spacing.md} ${DS.spacing.xl}`,
            borderRadius: DS.borderRadius.md,
            fontWeight: DS.typography.fontWeight.bold,
            fontSize: DS.typography.fontSize.base,
            transition: DS.transitions.base,
            backgroundColor: hoveredBtn === 'explorar' ? `${DS.colors.primary.main}CC` : DS.colors.primary.main,
            color: '#FFFFFF',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          onMouseEnter={() => setHoveredBtn('explorar')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🏠 Voltar para Home
        </Link>
      </div>
    </main>
  )
}