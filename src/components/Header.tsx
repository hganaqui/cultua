import { createServerSupabase } from '@/lib/supabase-server'
import HeaderClient from './HeaderClient'
import BuscaGlobalClient from './BuscaGlobalClient'
import Image from 'next/image'
import Link from 'next/link'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

// ── 6 categorias na navbar com SVGs ────────────────────────────────
const NAV_CATEGORIES = [
  { href: '/categoria/louvor',      label: 'Louvor',      icon: '/icons/louvor.svg'      },
  { href: '/categoria/pregacao',    label: 'Pregação',    icon: '/icons/pregacao.svg'    },
  { href: '/categoria/crescimento', label: 'Crescimento', icon: '/icons/crescimento.svg' },
  { href: '/categoria/testemunhos', label: 'Testemunhos', icon: '/icons/testemunhos.svg' },
  { href: '/categoria/familia',     label: 'Família',     icon: '/icons/familia.svg'     },
  { href: '/categoria/estudos',     label: 'Estudos',     icon: '/icons/estudos.svg'     },
]

export default async function Header() {
  let user    = null
  let profile = null

  try {
    const supabase = await createServerSupabase()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      user = currentUser
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, role')
        .eq('id', currentUser.id)
        .single()
      profile = data
    }
  } catch {
    // sem sessão — header anônimo
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: DS.colors.bg.secondary,
      borderBottom: `1px solid ${DS.colors.neutral.light}`,
      boxShadow: DS.shadows.sm,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: DS.typography.fontFamily.heading,
          fontSize: '20px',
          fontWeight: DS.typography.fontWeight.bold,
          color: DS.colors.primary.main,
          textDecoration: 'none',
          letterSpacing: '2px',
          flexShrink: 0,
        }}>
          CULTUA
        </Link>

        {/* ✅ Nav com SVGs EXTRA GRANDES (28x28) + labels */}
        <nav className="hdr-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0px',
          flex: 1,
        }}>
          {NAV_CATEGORIES.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="hdr-navlink"
              style={{
                fontFamily: DS.typography.fontFamily.body,
                color: DS.colors.text.secondary,
                textDecoration: 'none',
                fontSize: '13px',
                padding: '6px 8px',
                borderRadius: DS.borderRadius.md,
                fontWeight: DS.typography.fontWeight.medium,
                whiteSpace: 'nowrap' as const,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px', // ✅ aumentado de 6px para 8px (mais espaço para ícone maior)
              }}
            >
              {/* ✅ ÍCONE EXTRA GRANDE: 28x28 */}
              <Image
                src={item.icon}
                alt={item.label}
                width={28}
                height={28}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Busca + Auth */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}>
          <div className="hdr-busca-desktop">
            <BuscaGlobalClient />
          </div>
          <HeaderClient user={user} profile={profile} />
        </div>
      </div>

      <style>{`
        /* Esconde nav e busca no mobile */
        @media (max-width: 900px) {
          .hdr-nav           { display: none !important; }
          .hdr-busca-desktop { display: none !important; }
        }
        .hdr-navlink:hover {
          color: ${DS.colors.primary.main} !important;
          background-color: rgba(15,61,46,0.06);
        }
      `}</style>
    </header>
  )
}