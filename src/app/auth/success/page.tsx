import { Suspense } from 'react'
import SuccessClient from './SuccessClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

function SuccessLoading() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary,
        borderRadius: DS.borderRadius.xl, padding: '40px',
        textAlign: 'center',
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
      }}>
        Carregando...
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessClient />
    </Suspense>
  )
}