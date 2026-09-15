import { Suspense } from 'react'
import ErrorClient from './ErrorClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

function ErrorLoading() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: DS.colors.bg.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: DS.colors.bg.secondary,
        borderRadius: DS.borderRadius.xl,
        padding: '40px',
        textAlign: 'center',
        fontFamily: DS.typography.fontFamily.body,
        color: DS.colors.text.secondary,
      }}>
        Carregando...
      </div>
    </main>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<ErrorLoading />}>
      <ErrorClient />
    </Suspense>
  )
}