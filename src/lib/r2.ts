// src/lib/r2.ts
// Funções de upload para Cloudflare R2 via API Routes
// O upload direto do browser não é feito aqui — usamos presigned URLs

export type UploadType = 'video' | 'thumb'

// Gera nome único para o arquivo
export function generateFileName(originalName: string, type: UploadType): string {
  const ext       = originalName.split('.').pop()?.toLowerCase() ?? 'mp4'
  const timestamp = Date.now()
  const random    = Math.random().toString(36).slice(2, 8)
  const folder    = type === 'video' ? 'videos' : 'thumbs'
  return `${folder}/${timestamp}-${random}.${ext}`
}

// Monta a URL pública final do arquivo
export function getPublicUrl(fileName: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''
  return `${base}/${fileName}`
}

// Limites de arquivo
export const UPLOAD_LIMITS = {
  video: {
    maxSizeMB: 500,
    maxSizeBytes: 500 * 1024 * 1024,
    acceptedTypes: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
    acceptedExts: '.mp4,.webm,.mov,.avi',
  },
  thumb: {
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptedExts: '.jpg,.jpeg,.png,.webp',
  },
  audio: {
    maxSizeMB: 100,
    maxSizeBytes: 100 * 1024 * 1024,
    acceptedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    acceptedExts: '.mp3,.wav,.ogg',
  },
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k    = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i    = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}