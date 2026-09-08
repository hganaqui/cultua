// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1A1A1A',
      borderTop: '1px solid #333333',
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
              fontWeight: '900',
              color: '#B8860B',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}>
              CULTUA
            </div>
            <p style={{
              color: '#666666',
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
                  color: '#B8860B',
                  backgroundColor: 'rgba(184,134,11,0.1)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(184,134,11,0.2)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 style={{ color: '#CCCCCC', fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>
              Categorias
            </h4>
            {[
              { icon: '🎵', name: 'Louvor', href: '/categoria/louvor' },
              { icon: '📖', name: 'Pregação', href: '/categoria/pregacao' },
              { icon: '💪', name: 'Crescimento', href: '/categoria/crescimento' },
              { icon: '🤝', name: 'Comunidade', href: '/categoria/comunidade' },
            ].map(item => (
              <Link key={item.name} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#666666',
                textDecoration: 'none',
                fontSize: '14px',
                marginBottom: '10px',
                transition: 'color 0.2s',
              }}>
                {item.icon} {item.name}
              </Link>
            ))}
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#CCCCCC', fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>
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
                color: '#666666',
                textDecoration: 'none',
                fontSize: '14px',
                marginBottom: '10px',
              }}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid #333333',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <span style={{ color: '#444444', fontSize: '13px' }}>
            © 2026 CULTUA. Todos os direitos reservados.
          </span>
          <span style={{ color: '#444444', fontSize: '13px' }}>
            Feito com 🙏 para a comunidade cristã
          </span>
        </div>
      </div>
    </footer>
  )
}