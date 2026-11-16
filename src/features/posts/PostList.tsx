import type { PostListItem } from './types.ts'

interface PostListProps {
  posts: PostListItem[]
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
            <h3>
              {post.title}
              {post.isLocal && (
                <span className="badge" title="The demo API does not save posts; it is kept only in this session.">
                  Not saved on server
                </span>
              )}
            </h3>
            <p>{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
