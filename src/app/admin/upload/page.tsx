import UploadClient from './UploadClient'
import type { Metadata } from 'next'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = { title: 'Upload de Conteúdo — CULTUA' }

export default function UploadPage() {
  // ✅ SEM <Header /> — já vem do layout.tsx
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <UploadClient />
    </div>
  )
}