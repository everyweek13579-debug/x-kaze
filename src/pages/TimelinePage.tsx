import { usePosts } from '../hooks/usePosts'
import { PostForm } from '../components/PostForm'
import { PostList } from '../components/PostList'

export function TimelinePage() {
  const { posts, loading, error, addPost, deletePost } = usePosts()

  return (
    <div className="timeline">
      <PostForm addPost={addPost} onPost={() => {}} />
      {loading && <p className="loading">読み込み中...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && <PostList posts={posts} onDelete={deletePost} />}
    </div>
  )
}
