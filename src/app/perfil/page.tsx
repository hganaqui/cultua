// src/app/perfil/page.tsx — Server Component simples, sem getServerUser
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerfilClient from './PerfilClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meu Perfil' }

export default function PerfilPage() {
  // Proteção já feita pelo proxy.ts
  // Dados do usuário lidos no Client via supabase.auth.getUser()
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <PerfilClient />
      <Footer />
    </div>
  )
}