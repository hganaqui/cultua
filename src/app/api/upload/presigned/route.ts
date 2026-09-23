// src/app/api/upload/presigned/route.ts — CRIAR ESSE ARQUIVO

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { generateFileName } from '@/lib/r2'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Autenticação
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // ✅ 2. Validar body
    const body = await req.json()
    const { fileName, fileType, uploadType } = body as {
      fileName:   string
      fileType:   string
      uploadType: 'video' | 'thumb'
    }

    if (!fileName || !fileType || !uploadType) {
      return NextResponse.json(
        { error: 'fileName, fileType e uploadType são obrigatórios' },
        { status: 400 }
      )
    }

    // ✅ 3. Verificar env vars — usando os nomes EXATOS do seu .env
    const accountId      = process.env.CLOUDFLARE_R2_ACCOUNT_ID
    const accessKeyId    = process.env.CLOUDFLARE_R2_ACCESS_KEY
    const secretKey      = process.env.CLOUDFLARE_R2_SECRET
    const bucketName     = process.env.CLOUDFLARE_R2_BUCKET_NAME
    const publicUrl      = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

    if (!accountId || !accessKeyId || !secretKey || !bucketName || !publicUrl) {
      console.error('[presigned] Env vars ausentes:', {
        accountId:   !!accountId,
        accessKeyId: !!accessKeyId,
        secretKey:   !!secretKey,
        bucketName:  !!bucketName,
        publicUrl:   !!publicUrl,
      })
      return NextResponse.json(
        { error: 'Configuração de storage incompleta.' },
        { status: 500 }
      )
    }

    // ✅ 4. Gerar key única usando a função do r2.ts
    const key = generateFileName(fileName, uploadType)

    // ✅ 5. Gerar presigned URL com AWS SDK v3 (R2 é S3-compatible)
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
    const { getSignedUrl }               = await import('@aws-sdk/s3-request-presigner')

    const s3 = new S3Client({
      region:   'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId:     accessKeyId,
        secretAccessKey: secretKey,
      },
    })

    const command = new PutObjectCommand({
      Bucket:      bucketName,
      Key:         key,
      ContentType: fileType,
    })

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    const finalPublicUrl = `${publicUrl}/${key}`

    console.log('[presigned] URL gerada para:', key)

    return NextResponse.json({
      presignedUrl,
      publicUrl: finalPublicUrl,
      key,
    })

  } catch (err) {
    console.error('[presigned] Erro:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    )
  }
}