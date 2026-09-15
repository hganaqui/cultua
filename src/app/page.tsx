import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import HomeClient from './HomeClient'
import { DESIGN_SYSTEM } from '@/lib/design-system'

const DS = DESIGN_SYSTEM

// ✅ SEM <Header /> e SEM <Footer /> — já vêm do layout.tsx
export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: DS.colors.bg.primary }}>
      <Hero />
      <CategorySection />
      <HomeClient />
    </div>
  )
}