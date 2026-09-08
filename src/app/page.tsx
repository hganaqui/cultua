import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import VideoCard from '@/components/VideoCard'
import Footer from '@/components/Footer'

const MOCK_VIDEOS = [
  { id: '1', title: 'A Graça de Deus em Nossas Vidas', creator: 'Pastor João Silva', category: 'Pregação', categoryColor: '#D4AF37', duration: '45:30', views: 12400 },
  { id: '2', title: 'Louvor ao Criador - Playlist Completa', creator: 'Grupo Adoração', category: 'Louvor', categoryColor: '#B8860B', duration: '1h 20m', views: 8900 },
  { id: '3', title: 'Devocional: Paz que Excede', creator: 'Pastora Maria', category: 'Crescimento', categoryColor: '#4CAF50', duration: '15:00', views: 5600 },
  { id: '4', title: 'Estudo Bíblico: Salmos 23', creator: 'Rev. Carlos', category: 'Pregação', categoryColor: '#D4AF37', duration: '52:10', views: 9800 },
  { id: '5', title: 'Testemunho: Deus me Restaurou', creator: 'Ana Paula', category: 'Comunidade', categoryColor: '#1A3A52', duration: '28:45', views: 4200 },
  { id: '6', title: 'Adoração em Espírito e Verdade', creator: 'Ministério Ágape', category: 'Louvor', categoryColor: '#B8860B', duration: '1h 05m', views: 15300 },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <style>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .video-section-header {
          flex-direction: row;
        }
        @media (max-width: 1024px) {
          .video-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .video-grid { grid-template-columns: 1fr !important; }
          .video-section-header { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      <Header />
      <Hero />
      <CategorySection />

      {/* Grid de Vídeos */}
      <section id="conteudo" style={{ padding: '64px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div className="video-section-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>
                🔥 Mais Assistidos
              </h2>
              <p style={{ color: '#666666', fontSize: '14px' }}>
                Conteúdo que está edificando a comunidade
              </p>
            </div>
            <a href="/explorar" style={{
              color: '#B8860B',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid #B8860B',
              padding: '8px 16px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}>
              Ver todos →
            </a>
          </div>

          <div className="video-grid">
            {MOCK_VIDEOS.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '64px 16px',
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#B8860B', marginBottom: '16px' }}>
            Junte-se à CULTUA
          </h2>
          <p style={{ color: '#CCCCCC', fontSize: '16px', marginBottom: '32px', lineHeight: 1.7 }}>
            Acesse conteúdo cristão de qualidade, sem interrupções e totalmente gratuito.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/auth/signup" style={{
              backgroundColor: '#B8860B',
              color: 'white',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
            }}>
              🙏 Criar Conta Gratuita
            </a>
            <a href="/explorar" style={{
              backgroundColor: 'transparent',
              color: '#CCCCCC',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid #444444',
            }}>
              Explorar Conteúdo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}