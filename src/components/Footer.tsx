'use client'

import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: DS.colors.primary.main,
      borderTop: `2px solid ${DS.colors.primary.accent}`,
      padding: '48px 16px 24px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: DS.typography.fontWeight.extrabold,
              color: DS.colors.primary.accent,
              letterSpacing: '2px',
              marginBottom: '12px',
            }}>
              CULTUA
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}>
              Celebre sua fé sem distrações.
              Conteúdo cristão 100% sem interrupções.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['🚫 Sem Interrupções', '✅ Curado', '🔒 Seguro'].map(tag => (
                <span key={tag} style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: DS.colors.primary.accent,
                  backgroundColor: 'rgba(212, 175, 124, 0.2)',
                  padding: '3px 10px',
                  borderRadius: DS.borderRadius.full,
                  border: `1px solid ${DS.colors.primary.accent}40`,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 style={{ color: DS.colors.primary.accent, fontSize: '14px', fontWeight: DS.typography.fontWeight.bold, marginBottom: '16px' }}>
              Categorias
            </h4>
            {[
              { icon: '🎵', name: 'Louvor', href: '/categoria/louvor' },
              { icon: '📖', name: 'Pregação', href: '/categoria/pregacao' },
              { icon: '🌱', name: 'Crescimento', href: '/categoria/crescimento' },
              { icon: '🙏', name: 'Testemunhos', href: '/categoria/testemunhos' },
            ].map(item => (
              <Link key={item.name} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                marginBottom: '10px',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = DS.colors.primary.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
              }}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: DS.colors.primary.accent, fontSize: '14px', fontWeight: DS.typography.fontWeight.bold, marginBottom: '16px' }}>
              Plataforma
            </h4>
            {[
              { name: 'Sobre nós', href: '/sobre' },
              { name: 'Para Igrejas', href: '/igrejas' },
              { name: 'Seja um Criador', href: '/criadores' },
              { name: 'Suporte', href: '/suporte' },
              { name: 'Privacidade', href: '/privacidade' },
            ].map(item => (
              <Link key={item.name} href={item.href} style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                marginBottom: '10px',
                transition: DS.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = DS.colors.primary.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
              }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: `1px solid ${DS.colors.primary.accent}40`,
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
            © 2026 CULTUA. Todos os direitos reservados.
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
            Feito com 🙏 para a comunidade cristã
          </span>
        </div>
      </div>
    </footer>
  )
}