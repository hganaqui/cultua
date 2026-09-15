'use client'

import Link from 'next/link'
import Image from 'next/image'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

// ✅ SVGs em vez de emojis
const CATEGORIAS = [
  { icon: '/icons/louvor.svg',      name: 'Louvor',      href: '/categoria/louvor' },
  { icon: '/icons/pregacao.svg',    name: 'Pregação',    href: '/categoria/pregacao' },
  { icon: '/icons/crescimento.svg', name: 'Crescimento', href: '/categoria/crescimento' },
  { icon: '/icons/testemunhos.svg', name: 'Testemunhos', href: '/categoria/testemunhos' },
  { icon: '/icons/familia.svg',     name: 'Família',     href: '/categoria/familia' },
  { icon: '/icons/estudos.svg',     name: 'Estudos',     href: '/categoria/estudos' },
]

const PLATAFORMA = [
  { name: 'Sobre nós',       href: '/sobre' },
  { name: 'Para Igrejas',    href: '/igrejas' },
  { name: 'Seja um Criador', href: '/criadores' },
  { name: 'Suporte',         href: '/suporte' },
  { name: 'Privacidade',     href: '/privacidade' },
]

const linkStyle = {
  color: 'rgba(255,255,255,0.65)',
  textDecoration: 'none',
  fontSize: '14px',
  fontFamily: DS.typography.fontFamily.body,
  lineHeight: '1',
  transition: DS.transitions.fast,
} as const

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: DS.colors.primary.main,
      borderTop: `2px solid ${DS.colors.primary.accent}`,
      padding: '56px 16px 28px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Grid principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>

          {/* Coluna Brand */}
          <div>
            {/* Logo text */}
            <div style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: '22px',
              fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.primary.accent,
              letterSpacing: '3px',
              marginBottom: '12px',
            }}>
              CULTUA
            </div>

            <p style={{
              fontFamily: DS.typography.fontFamily.body,
              color: 'rgba(255,255,255,0.65)',
              fontSize: '14px',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}>
              Conteúdo para edificar sua fé.
              Pregações, louvores, devocionais e
              testemunhos — curados para você.
            </p>

            {/* Pilares */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['✅ Curado', '🔒 Seguro', '🙏 Intencional'].map(tag => (
                <span key={tag} style={{
                  fontSize: '11px',
                  fontFamily: DS.typography.fontFamily.body,
                  fontWeight: DS.typography.fontWeight.semibold,
                  color: DS.colors.primary.accent,
                  backgroundColor: 'rgba(212, 163, 115, 0.15)',
                  padding: '4px 10px',
                  borderRadius: DS.borderRadius.full,
                  border: `1px solid rgba(212, 163, 115, 0.3)`,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Coluna Categorias */}
          <div>
            <h4 style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: '13px',
              fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.primary.accent,
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              marginBottom: '20px',
            }}>
              Categorias
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {CATEGORIAS.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    ...linkStyle,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = DS.colors.primary.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {/* ✅ SVG com filter para virar branco/dourado */}
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={16}
                    height={16}
                    style={{
                      display: 'block',
                      filter: 'brightness(0) invert(1)', // ✅ Inverte cores (verde → branco)
                    }}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna Plataforma */}
          <div>
            <h4 style={{
              fontFamily: DS.typography.fontFamily.heading,
              fontSize: '13px',
              fontWeight: DS.typography.fontWeight.bold,
              color: DS.colors.primary.accent,
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              marginBottom: '20px',
            }}>
              Plataforma
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {PLATAFORMA.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = DS.colors.primary.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div style={{
          borderTop: `1px solid rgba(212, 163, 115, 0.25)`,
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{
            fontFamily: DS.typography.fontFamily.body,
            color: 'rgba(255,255,255,0.45)',
            fontSize: '13px',
          }}>
            © {new Date().getFullYear()} CULTUA. Todos os direitos reservados.
          </span>
          <span style={{
            fontFamily: DS.typography.fontFamily.body,
            color: 'rgba(255,255,255,0.45)',
            fontSize: '13px',
          }}>
            Feito com 🙏 para a comunidade cristã
          </span>
        </div>

      </div>
    </footer>
  )
}