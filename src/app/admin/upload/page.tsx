import Header from '@/components/Header'
import UploadClient from './UploadClient'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Upload de Conteúdo' }

export default function UploadPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Header />
      <UploadClient />
    </div>
  )
}