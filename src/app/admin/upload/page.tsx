// src/app/admin/upload/page.tsx
import Header from '@/components/Header'
import UploadClient from './UploadClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Upload de Conteúdo' }

export default function UploadPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1A' }}>
      <Header />
      <UploadClient />
    </div>
  )
}