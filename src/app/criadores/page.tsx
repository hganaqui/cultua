import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Criadores — CULTUA' }

export default function CriadoresPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🎙️</div>
        <h1 style={{ color: DS.colors.text.dark, fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Para Criadores
        </h1>
        <p style={{ color: DS.colors.text.secondary, fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
          Compartilhe pregações, louvores e testemunhos com a comunidade cristã.
          Seu conteúdo passa por curadoria antes de ser publicado.
        </p>
        <a href="/admin/upload" style={{
          display: 'inline-block', 
          backgroundColor: DS.colors.primary.main, 
          color: 'white',
          textDecoration: 'none', 
          padding: '12px 28px', 
          borderRadius: DS.borderRadius.md,
          fontSize: '15px', 
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
          Enviar conteúdo →
        </a>
      </main>
      <Footer />
    </div>
  )
}