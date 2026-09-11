// src/app/not-found.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: 'A página que você procura não existe ou foi removida.',
}

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111111',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        fontFamily: 'inherit',
      }}
    >
      {/* ✅ Imagem 404 */}
      <div style={{ marginBottom: 32, maxWidth: 240 }}>
        <Image
          src="/404-not-found.jpg"
          alt="Conteúdo não encontrado"
          width={240}
          height={240}
          priority
          style={{ width: '100%', height: 'auto', borderRadius: 16 }}
        />
      </div>

      {/* Título */}
      <h1
        style={{
          fontSize: 'clamp(20px, 5vw, 32px)',
          fontWeight: 700,
          color: '#f5a623',
          margin: '0 0 12px',
          letterSpacing: -1,
        }}
      >
        Conteúdo não encontrado
      </h1>

      {/* Subtítulo */}
      <p
        style={{
          color: '#888888',
          fontSize: 16,
          maxWidth: 420,
          lineHeight: 1.7,
          margin: '0 0 40px',
        }}
      >
        O conteúdo que você procura pode ter sido removido
        ou o endereço está incorreto.
      </p>

      {/* Versículo */}
      <blockquote
        style={{
          borderLeft: '3px solid #f5a623',
          paddingLeft: 20,
          margin: '0 0 48px',
          maxWidth: 440,
          textAlign: 'left',
        }}
      >
        <p
          style={{
            color: '#aaaaaa',
            fontStyle: 'italic',
            margin: '0 0 10px',
            lineHeight: 1.7,
            fontSize: 15,
          }}
        >
          "Porque eu sei os planos que tenho para vocês, planos de fazê-los
          prosperar e não de causar dano, planos de dar a vocês esperança
          e um futuro."
        </p>
        <cite style={{ color: '#f5a623', fontSize: 13, fontWeight: 700 }}>
          Jeremias 29:11
        </cite>
      </blockquote>

      {/* Ações */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            background: '#f5a623',
            color: '#000000',
            padding: '14px 32px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 16,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          🏠 Voltar ao Início
        </Link>

        <Link
          href="/explorar"
          style={{
            background: 'transparent',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
            border: '1px solid #333333',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#f5a623')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333333')}
        >
          🔍 Explorar Conteúdos
        </Link>
      </div>
    </main>
  )
}