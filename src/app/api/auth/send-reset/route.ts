import { Resend } from 'resend' // ou nodemailer
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, resetToken } = await request.json()

    if (!email || !resetToken) {
      return NextResponse.json(
        { error: 'Email e token são obrigatórios' },
        { status: 400 }
      )
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    const result = await resend.emails.send({
      from: 'noreply@cultua.com.br',
      to: email,
      subject: 'Redefinir Senha — CULTUA 🔐',
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
              }
              .container { 
                background: white; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 40px 30px; 
                border-radius: 12px;
              }
              .logo {
                font-size: 24px;
                font-weight: 800;
                color: #1E3A2E;
                letter-spacing: 2px;
                text-align: center;
                margin-bottom: 20px;
              }
              h2 { 
                color: #1E3A2E;
                text-align: center;
              }
              .button { 
                background: #C84C3C; 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 8px; 
                display: inline-block; 
                margin: 24px auto; 
                font-weight: bold;
              }
              .footer { 
                color: #6B6B6B; 
                font-size: 12px; 
                text-align: center; 
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🔐 CULTUA</div>
              <h2>Redefinir Senha</h2>

              <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo:</p>

              <center>
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </center>

              <p style="color: #6B6B6B; font-size: 13px;">
                Se você não fez essa solicitação, ignore este email.
              </p>

              <p style="color: #6B6B6B; font-size: 13px;">
                Este link expira em 1 hora.
              </p>

              <div class="footer">
                <p>© 2026 CULTUA — Celebre sua fé sem distrações</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}