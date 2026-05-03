export interface Profile {
  id: string
  email: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: Pick<Profile, 'email'>
}
