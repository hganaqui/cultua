// src/app/admin/upload/UploadClient.tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UPLOAD_LIMITS, formatBytes } from '@/lib/r2'
import { CULTUA_CONFIG } from '@/lib/cultua-config'

const C = CULTUA_CONFIG.colors

type ContentType = 'video' | 'audio' | 'text'
type UploadStep  = 'form' | 'uploading' | 'success' | 'error'

interface FormState {
  title:       string
  description: string
  type:        ContentType
  categoryId:  string
  duration:    string
}

interface UploadProgress {
  video:   number
  thumb:   number
  current: 'video' | 'thumb' | 'saving' | 'done'
}

export default function UploadClient() {
  const router  = useRouter()

  const [step, setStep]         = useState<UploadStep>('form')
  const [authorized, setAuth]   = useState<boolean | null>(null)
  const [categories, setCats]   = useState<{ id: string; name: string; icon: string | null }[]>([])
  const [form, setForm]         = useState<FormState>({
    title: '', description: '', type: 'video', categoryId: '', duration: '',
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState<UploadProgress>({ video: 0, thumb: 0, current: 'video' })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [contentId, setContentId] = useState<string | null>(null)

  const videoRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  // Verifica permissão ao montar
  useState(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()

      if (!profile || !['moderator', 'admin'].includes(profile.role)) {
        router.push('/'); return
      }
      setAuth(true)

      // Carrega categorias
      const { data: cats } = await supabase
        .from('categories').select('id, name, icon').order('name')
      setCats(cats ?? [])
      if (cats?.[0]) setForm(f => ({ ...f, categoryId: cats[0].id }))
    }
    check()
  })

  // ── Seleção de arquivo de vídeo ──────────────────────────────
  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const limit = form.type === 'audio' ? UPLOAD_LIMITS.audio : UPLOAD_LIMITS.video

    if (!limit.acceptedTypes.includes(file.type)) {
      setErrorMsg(`Tipo de arquivo não suportado. Use: ${limit.acceptedExts}`)
      return
    }
    if (file.size > limit.maxSizeBytes) {
      setErrorMsg(`Arquivo muito grande. Máximo: ${limit.maxSizeMB}MB`)
      return
    }

    setErrorMsg(null)
    setVideoFile(file)
  }

  // ── Seleção de thumbnail ─────────────────────────────────────
  function handleThumbSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > UPLOAD_LIMITS.thumb.maxSizeBytes) {
      setErrorMsg('Thumbnail muito grande. Máximo: 5MB')
      return
    }

    setErrorMsg(null)
    setThumbFile(file)

    // Preview
    const reader = new FileReader()
    reader.onload = (ev) => setThumbPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // ── Upload de um arquivo via presigned URL ───────────────────
  async function uploadFile(
    file: File,
    uploadType: 'video' | 'thumb',
    onProgress: (pct: number) => void
  ): Promise<string> {
    // 1. Pede presigned URL para o servidor
    const res = await fetch('/api/upload/presigned', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        fileName:   file.name,
        fileType:   file.type,
        uploadType,
      }),
    })

    if (!res.ok) throw new Error('Erro ao gerar URL de upload')
    const { presignedUrl, publicUrl } = await res.json()

    // 2. Faz upload direto para o R2 via XMLHttpRequest (suporta progresso)
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload  = () => xhr.status === 200 ? resolve() : reject(new Error(`Upload falhou: ${xhr.status}`))
      xhr.onerror = () => reject(new Error('Erro de rede no upload'))

      xhr.open('PUT', presignedUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })

    return publicUrl
  }

  // ── Submit principal ─────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.title || !form.categoryId) {
      setErrorMsg('Preencha o título e selecione uma categoria.')
      return
    }
    if (form.type !== 'text' && !videoFile) {
      setErrorMsg('Selecione um arquivo de vídeo ou áudio.')
      return
    }

    setStep('uploading')
    setErrorMsg(null)

    try {
      let urlMedia: string | null = null
      let urlThumb: string | null = null

      // 1. Upload do vídeo/áudio
      if (videoFile) {
        setProgress({ video: 0, thumb: 0, current: 'video' })
        urlMedia = await uploadFile(videoFile, 'video', (pct) => {
          setProgress(p => ({ ...p, video: pct }))
        })
      }

      // 2. Upload da thumbnail (opcional)
      if (thumbFile) {
        setProgress(p => ({ ...p, current: 'thumb' }))
        urlThumb = await uploadFile(thumbFile, 'thumb', (pct) => {
          setProgress(p => ({ ...p, thumb: pct }))
        })
      }

      // 3. Salva no Supabase como "pending" (aguarda curadoria)
      setProgress(p => ({ ...p, current: 'saving' }))

      const { data: { user } } = await supabase.auth.getUser()

      const { data: content, error } = await supabase
        .from('contents')
        .insert({
          title:       form.title.trim(),
          description: form.description.trim() || null,
          type:        form.type,
          status:      'pending',      // vai para fila de curadoria
          url_media:   urlMedia,
          url_thumb:   urlThumb,
          duration:    form.duration.trim() || null,
          category_id: form.categoryId,
          creator_id:  user?.id ?? null,
          is_featured: false,
        })
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      setContentId(content.id)
      setProgress(p => ({ ...p, current: 'done' }))
      setStep('success')

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setErrorMsg(message)
      setStep('error')
    }
  }

  // ── Loading de verificação ───────────────────────────────────
  if (authorized === null) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#666' }}>
      Verificando permissões...
    </div>
  )

  // ── Sucesso ──────────────────────────────────────────────────
  if (step === 'success') return (
    <main style={{ maxWidth: '600px', margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ color: '#FFF', fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
        Upload concluído!
      </h1>
      <p style={{ color: '#999', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
        O conteúdo foi enviado e está na fila de curadoria.
        Acesse o painel para aprovar e publicar.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/admin" style={{
          backgroundColor: '#B8860B', color: 'white', textDecoration: 'none',
          padding: '12px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
        }}>
          🛡️ Ir para Curadoria
        </a>
        <button onClick={() => {
          setStep('form')
          setVideoFile(null)
          setThumbFile(null)
          setThumbPreview(null)
          setForm({ title: '', description: '', type: 'video', categoryId: categories[0]?.id ?? '', duration: '' })
        }} style={{
          backgroundColor: '#2D2D2D', color: '#CCC', border: '1px solid #3D3D3D',
          padding: '12px 24px', borderRadius: '10px', fontSize: '15px',
          fontWeight: '600', cursor: 'pointer',
        }}>
          + Novo Upload
        </button>
      </div>
    </main>
  )

  // ── Uploading ────────────────────────────────────────────────
  if (step === 'uploading') return (
    <main style={{ maxWidth: '500px', margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>⬆️</div>
      <h2 style={{ color: '#FFF', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
        {progress.current === 'video'  && 'Enviando vídeo...'}
        {progress.current === 'thumb'  && 'Enviando thumbnail...'}
        {progress.current === 'saving' && 'Salvando no banco...'}
        {progress.current === 'done'   && 'Concluído!'}
      </h2>

      {/* Barra de progresso do vídeo */}
      {videoFile && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#999', fontSize: '13px' }}>
              {form.type === 'audio' ? 'Áudio' : 'Vídeo'}
            </span>
            <span style={{ color: '#B8860B', fontSize: '13px', fontWeight: '600' }}>
              {progress.video}%
            </span>
          </div>
          <div style={{ backgroundColor: '#2D2D2D', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', backgroundColor: '#B8860B', borderRadius: '9999px',
              width: `${progress.video}%`, transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* Barra de progresso da thumb */}
      {thumbFile && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#999', fontSize: '13px' }}>Thumbnail</span>
            <span style={{ color: '#B8860B', fontSize: '13px', fontWeight: '600' }}>
              {progress.thumb}%
            </span>
          </div>
          <div style={{ backgroundColor: '#2D2D2D', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', backgroundColor: '#B8860B', borderRadius: '9999px',
              width: `${progress.thumb}%`, transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      <p style={{ color: '#555', fontSize: '13px', marginTop: '16px' }}>
        Não feche esta janela durante o upload
      </p>
    </main>
  )

  // ── Formulário ───────────────────────────────────────────────
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 16px' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFF', marginBottom: '4px' }}>
          📤 Upload de Conteúdo
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          O conteúdo será enviado para curadoria antes de ser publicado
        </p>
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px', padding: '14px 16px', marginBottom: '24px',
          color: '#F87171', fontSize: '14px',
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ── Tipo de conteúdo ── */}
        <Card title="Tipo de Conteúdo">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {([
              { value: 'video', label: '🎬 Vídeo' },
              { value: 'audio', label: '🎵 Áudio' },
              { value: 'text',  label: '📝 Texto' },
            ] as { value: ContentType; label: string }[]).map(opt => (
              <button key={opt.value} type="button"
                onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                style={{
                  padding: '10px 20px', borderRadius: '9999px', border: 'none',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  backgroundColor: form.type === opt.value ? '#B8860B' : '#2D2D2D',
                  color: form.type === opt.value ? 'white' : '#999',
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {/* ── Informações ── */}
        <Card title="Informações">

          {/* Título */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Título *</label>
            <input
              type="text" required
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: A Graça de Deus em Nossas Vidas"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#B8860B')}
              onBlur={(e)  => (e.target.style.borderColor = '#3D3D3D')}
            />
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descreva o conteúdo..."
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#B8860B')}
              onBlur={(e)  => (e.target.style.borderColor = '#3D3D3D')}
            />
          </div>

          {/* Categoria + Duração lado a lado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Categoria *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}
                required
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duração</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="Ex: 45:30 ou 1h 20m"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#B8860B')}
                onBlur={(e)  => (e.target.style.borderColor = '#3D3D3D')}
              />
            </div>
          </div>
        </Card>

        {/* ── Arquivo de mídia ── */}
        {form.type !== 'text' && (
          <Card title={form.type === 'audio' ? 'Arquivo de Áudio' : 'Arquivo de Vídeo'}>
            <div
              onClick={() => videoRef.current?.click()}
              style={{
                border: `2px dashed ${videoFile ? '#B8860B' : '#3D3D3D'}`,
                borderRadius: '12px', padding: '32px',
                textAlign: 'center', cursor: 'pointer',
                backgroundColor: videoFile ? 'rgba(184,134,11,0.05)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                {form.type === 'audio' ? '🎵' : '🎬'}
              </div>
              {videoFile ? (
                <>
                  <p style={{ color: '#B8860B', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
                    ✅ {videoFile.name}
                  </p>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    {formatBytes(videoFile.size)}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: '#CCCCCC', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                    Clique para selecionar o arquivo
                  </p>
                  <p style={{ color: '#555', fontSize: '12px' }}>
                    {form.type === 'audio'
                      ? `MP3, WAV, OGG — máx. ${UPLOAD_LIMITS.audio.maxSizeMB}MB`
                      : `MP4, WebM, MOV — máx. ${UPLOAD_LIMITS.video.maxSizeMB}MB`
                    }
                  </p>
                </>
              )}
            </div>
            <input
              ref={videoRef}
              type="file"
              accept={form.type === 'audio' ? UPLOAD_LIMITS.audio.acceptedExts : UPLOAD_LIMITS.video.acceptedExts}
              onChange={handleVideoSelect}
              style={{ display: 'none' }}
            />
          </Card>
        )}

        {/* ── Thumbnail ── */}
        <Card title="Thumbnail (opcional)">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

            {/* Preview */}
            <div style={{
              width: '120px', height: '68px', flexShrink: 0,
              backgroundColor: '#2D2D2D', borderRadius: '8px', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundImage: thumbPreview ? `url(${thumbPreview})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              fontSize: '28px',
            }}>
              {!thumbPreview && '🖼️'}
            </div>

            <div style={{ flex: 1 }}>
              <button type="button"
                onClick={() => thumbRef.current?.click()}
                style={{
                  backgroundColor: '#2D2D2D', color: '#CCC',
                  border: '1px solid #3D3D3D', borderRadius: '8px',
                  padding: '10px 16px', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', marginBottom: '8px',
                }}
              >
                {thumbPreview ? '🔄 Trocar imagem' : '📷 Selecionar imagem'}
              </button>
              <p style={{ color: '#555', fontSize: '12px' }}>
                JPG, PNG, WebP — máx. {UPLOAD_LIMITS.thumb.maxSizeMB}MB
                <br />Recomendado: 1280×720px (16:9)
              </p>
              <input
                ref={thumbRef}
                type="file"
                accept={UPLOAD_LIMITS.thumb.acceptedExts}
                onChange={handleThumbSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </Card>

        {/* ── Botão submit ── */}
        <button
          type="submit"
          disabled={!form.title || !form.categoryId || (form.type !== 'text' && !videoFile)}
          style={{
            width: '100%', backgroundColor: '#B8860B', color: 'white',
            border: 'none', borderRadius: '12px', padding: '16px',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            opacity: (!form.title || !form.categoryId || (form.type !== 'text' && !videoFile)) ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          📤 Enviar para Curadoria
        </button>

        <p style={{ color: '#555', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
          O conteúdo ficará como "Pendente" até ser aprovado por um moderador
        </p>

      </form>
    </main>
  )
}

// ── Sub-componentes ──────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#222', borderRadius: '16px', padding: '24px',
      marginBottom: '16px', border: '1px solid #2D2D2D',
    }}>
      <h2 style={{
        fontSize: '13px', fontWeight: '700', color: '#999',
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#CCCCCC', fontSize: '13px',
  fontWeight: '600', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#2D2D2D', border: '1.5px solid #3D3D3D',
  borderRadius: '10px', padding: '12px 16px', color: '#FFFFFF', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}