// src/app/page.tsx
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import Footer from '@/components/Footer'
import HomeClient from './HomeClient'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header />
      <Hero />
      <CategorySection />
      <HomeClient />
      <Footer />
    </div>
  )
}