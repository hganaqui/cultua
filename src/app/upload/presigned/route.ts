// src/app/api/upload/presigned/route.ts
// Gera uma presigned URL para o browser fazer upload direto ao R2
// Assim o arquivo NÃO passa pelo servidor da Vercel (evita limite de 4MB)

import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { generateFileName } from '@/lib/r2'

// R2 é compatível com a API S3 da AWS
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET!,
  },
})

export async function POST(request: Request) {
  try {
    const { fileName, fileType, uploadType } = await request.json()

    if (!fileName || !fileType || !uploadType) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    // Gera nome único para evitar colisão
    const key = generateFileName(fileName, uploadType)

    // Cria o comando de upload
    const command = new PutObjectCommand({
      Bucket:      process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key:         key,
      ContentType: fileType,
    })

    // Gera URL assinada válida por 1 hora
    const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 })

    return NextResponse.json({
      presignedUrl,  // URL para o browser fazer PUT direto no R2
      key,           // nome do arquivo no bucket
      publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`, // URL final
    })
  } catch (err) {
    console.error('[presigned] error:', err)
    return NextResponse.json({ error: 'Erro ao gerar URL de upload' }, { status: 500 })
  }
}