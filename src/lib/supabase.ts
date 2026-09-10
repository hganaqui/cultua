// src/lib/supabase.ts — versão final limpa
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ CULTUA: Variáveis do Supabase não encontradas!\n' +
    'Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local'
  )
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export default supabase