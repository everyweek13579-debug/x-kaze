import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Post } from '../types'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      setError(error.message)
    } else {
      setPosts(data as Post[])
    }
    setLoading(false)
  }

  async function addPost(content: string, userId: string) {
    const { error } = await supabase
      .from('posts')
      .insert({ content, user_id: userId })

    if (error) throw error
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return { posts, loading, error, addPost, deletePost }
}
