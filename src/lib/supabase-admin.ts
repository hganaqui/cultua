// src/lib/supabase-admin.ts — ARQUIVO NOVO, só server-side
// ⚠️ NUNCA importar em Client Components ou em arquivos importados por eles

import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // sem NEXT_PUBLIC_ = só server
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)