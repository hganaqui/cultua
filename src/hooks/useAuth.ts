import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin' | 'superadmin'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession()

        if (authError) throw authError

        if (session?.user) {
          setUser(session.user)

          // Fetch profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role')
            .eq('id', session.user.id)
            .single()

          if (profileError) throw profileError
          setProfile(profileData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role')
            .eq('id', session.user.id)
            .single()
          setProfile(data)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, loading, error }
}