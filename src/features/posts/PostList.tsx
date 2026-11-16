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
            {/* The badge sits next to the heading, not inside it, so the
                heading's accessible name is just the post title. */}
            <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-semibold">{post.title}</h3>
              {post.isLocal && (
                <span
                  className="inline-block rounded-full border border-line bg-white px-2 py-px text-xs font-medium text-muted"
                  title="The demo API does not save posts; it is kept only in this session."
                >
                  Not saved on server
                </span>
              )}
            </div>
            <p className="text-muted">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
