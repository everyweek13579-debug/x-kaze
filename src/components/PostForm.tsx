import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePosts } from '../hooks/usePosts'

interface Props {
  onPost: () => void
  addPost: ReturnType<typeof usePosts>['addPost']
}

export function PostForm({ onPost, addPost }: Props) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const MAX = 280
  const remaining = MAX - content.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim() || remaining < 0) return

    setSubmitting(true)
    setError(null)
    try {
      await addPost(content.trim(), user.id)
      setContent('')
      onPost()
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        className="post-form-textarea"
        placeholder="いまどうしてる？"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
      />
      <div className="post-form-footer">
        <span className={`char-count ${remaining < 0 ? 'over' : remaining < 20 ? 'warn' : ''}`}>
          {remaining}
        </span>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitting || !content.trim() || remaining < 0}
        >
          {submitting ? '投稿中...' : 'つぶやく'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  )
}
