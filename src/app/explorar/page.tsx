import ExplorarClient from './ExplorarClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'
import type { Metadata } from 'next'

const DS = DESIGN_SYSTEM

export const metadata: Metadata = {
  title: 'Explorar — CULTUA',
  description: 'Descubra conteúdos cristãos curados para edificar sua fé.',
}

export default function ExplorarPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <ExplorarClient />
    </div>
  )
}