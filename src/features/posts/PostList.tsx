import type { PostListItem } from './types.ts'

interface PostListProps {
  posts: PostListItem[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-muted">This user has no posts yet.</p>
  }

  return (
    <ul className="grid gap-3" aria-label="Posts">
      {posts.map((post) => (
        <li key={post.id} className="rounded-lg border border-line px-4 py-3.5">
          <article>
            <h3 className="mb-1.5 font-semibold">
              {post.title}
              {post.isLocal && (
                <span
                  className="ml-2 inline-block rounded-full border border-line bg-white px-2 py-px align-middle text-xs font-medium text-muted"
                  title="The demo API does not save posts; it is kept only in this session."
                >
                  Not saved on server
                </span>
              )}
            </h3>
            <p className="text-muted">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
