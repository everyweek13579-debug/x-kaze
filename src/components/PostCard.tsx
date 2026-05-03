import type { Post } from '../types'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  post: Post
  onDelete: (id: string) => void
}

export function PostCard({ post, onDelete }: Props) {
  const { user } = useAuth()
  const isOwner = user?.id === post.user_id

  const date = new Date(post.created_at).toLocaleString('ja-JP', {
    month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <article className="post-card">
      <div className="post-card-header">
        <span className="post-card-email">{post.profiles?.email ?? '不明'}</span>
        <span className="post-card-date">{date}</span>
        {isOwner && (
          <button className="btn-delete" onClick={() => onDelete(post.id)} title="削除">✕</button>
        )}
      </div>
      <p className="post-card-content">{post.content}</p>
    </article>
  )
}
