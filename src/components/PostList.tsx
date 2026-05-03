import type { Post } from '../types'
import { PostCard } from './PostCard'

interface Props {
  posts: Post[]
  onDelete: (id: string) => void
}

export function PostList({ posts, onDelete }: Props) {
  if (posts.length === 0) {
    return <p className="empty">まだつぶやきがありません</p>
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard key={post.id} post={post} onDelete={onDelete} />
      ))}
    </div>
  )
}
