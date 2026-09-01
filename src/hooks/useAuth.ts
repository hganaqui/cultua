import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error: err,
        } = await supabase.auth.getSession()

        if (err) throw err
        if (session?.user) {
          // TODO: Fetch full user profile from users table
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  return { user, loading, error }
}