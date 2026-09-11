// src/app/api/upload/delete/route.ts
import { NextResponse } from 'next/server'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET!,
  },
})

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json()
    if (!key) return NextResponse.json({ error: 'Key inválida' }, { status: 400 })

    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key:    key,
    }))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[delete] error:', err)
    return NextResponse.json({ error: 'Erro ao deletar arquivo' }, { status: 500 })
  }
}