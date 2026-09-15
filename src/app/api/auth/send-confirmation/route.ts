import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email e token são obrigatórios' },
        { status: 400 }
      )
    }

    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?token=${token}&type=signup`

    const result = await resend.emails.send({
      from: 'noreply@cultua.com.br',
      to: email,
      subject: 'Confirme seu email — CULTUA 🙏',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                background: #F8F6EF; 
                padding: 20px;
                margin: 0;
              }
              .container { 
                background: white; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 40px 30px; 
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: 800;
                color: #1E3A2E;
                letter-spacing: 2px;
                margin-bottom: 20px;
              }
              h2 { 
                color: #1E3A2E;
                font-size: 24px;
                margin: 0 0 12px 0;
              }
              .subtitle {
                color: #6B6B6B;
                font-size: 14px;
                margin: 0 0 20px 0;
              }
              .content {
                color: #333;
                line-height: 1.6;
                font-size: 15px;
              }
              .button { 
                background: #1E3A2E; 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 8px; 
                display: inline-block; 
                margin: 24px 0; 
                font-weight: bold;
                text-align: center;
              }
              .button:hover {
                background: #2D5A45;
              }
              .link-text {
                color: #1E3A2E;
                word-break: break-all;
                font-size: 12px;
                background: #F8F6EF;
                padding: 12px;
                border-radius: 6px;
                margin: 16px 0;
              }
              .footer { 
                color: #6B6B6B; 
                font-size: 12px; 
                text-align: center; 
                margin-top: 40px;
                border-top: 1px solid #E8E3DE;
                padding-top: 20px;
              }
              .info-box {
                background: #F8F6EF;
                border-left: 4px solid #D4AF7C;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">✨ CULTUA</div>
                <h2>Bem-vindo ao CULTUA! 🙏</h2>
                <p class="subtitle">Plataforma de Conteúdo Cristão</p>
              </div>

              <div class="content">
                <p>Olá,</p>
                
                <p>Obrigado por se registrar em CULTUA! Para ativar sua conta e começar a explorar nosso conteúdo, confirme seu email clicando no botão abaixo:</p>

                <center>
                  <a href="${confirmUrl}" class="button">✓ Confirmar Email</a>
                </center>

                <div class="info-box">
                  <strong>Não funciona?</strong> Copie e cole este link no seu navegador:<br>
                  <span class="link-text">${confirmUrl}</span>
                </div>

                <p>Este link expira em 24 horas.</p>

                <p>Qualquer dúvida, entre em contato conosco em support@cultua.com.br</p>

                <p>
                  Bênçãos,<br>
                  <strong>Equipe CULTUA</strong>
                </p>
              </div>

              <div class="footer">
                <p>© 2026 CULTUA — Celebre sua fé sem distrações</p>
                <p>📧 support@cultua.com.br | 🌐 cultua.com.br</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email de confirmação' },
      { status: 500 }
    )
  }
}