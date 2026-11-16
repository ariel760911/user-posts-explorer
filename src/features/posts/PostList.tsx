import type { Post } from '../../api/types.ts'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="empty-state">This user has no posts yet.</p>
  }

  return (
    <ul className="post-list" aria-label="Posts">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <article>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
