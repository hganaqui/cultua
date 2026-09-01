export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: 'user' | 'moderator' | 'admin'
  created_at: string
  updated_at: string
}

export type Content = {
  id: string
  title: string
  description: string | null
  type: 'video' | 'audio' | 'text'
  status: 'pending' | 'approved' | 'rejected'
  creator_id: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  description: string | null
  slug: string
}

export type Comment = {
  id: string
  content_id: string
  user_id: string
  text: string
  created_at: string
  updated_at: string
}

export type Playlist = {
  id: string
  user_id: string
  title: string
  description: string | null
  created_at: string
}