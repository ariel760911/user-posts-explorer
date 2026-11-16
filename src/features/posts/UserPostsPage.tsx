import { useParams } from 'react-router'
import { NotFound } from '../../app/pages/NotFound.tsx'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { Loading } from '../../shared/ui/Loading.tsx'
import { useUsers } from '../users/useUsers.ts'
import { PostForm } from './PostForm.tsx'
import { PostList } from './PostList.tsx'
import { useCreatePost } from './useCreatePost.ts'
import { useUserPosts } from './useUserPosts.ts'

function parseUserId(raw: string | undefined): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null
  return Number(raw)
}

export function UserPostsPage() {
  const userId = parseUserId(useParams().userId)

  if (userId === null) return <NotFound />

  // key resets per-user state when navigating between users.
  return <UserPosts key={userId} userId={userId} />
}

function UserPosts({ userId }: { userId: number }) {
  // Reuses the cached users query: no extra request for the user's name.
  const { data: users } = useUsers()
  const { data: posts, isPending, isError, isFetching, refetch } = useUserPosts(userId)
  const createPost = useCreatePost(userId)

  const user = users?.find((candidate) => candidate.id === userId)

  if (users && !user) return <NotFound />

  return (
    <section className="user-posts" aria-labelledby="posts-heading">
      <h2 id="posts-heading">{user ? `Posts by ${user.name}` : 'Posts'}</h2>
      {isPending && <Loading label="Loading posts…" />}
      {isError && (
        <ErrorMessage
          message="We couldn't load this user's posts. Check your connection and try again."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      )}
      {posts && (
        <>
          <PostForm
            onSubmit={async (values) => {
              await createPost.mutateAsync(values)
            }}
            isSubmitting={createPost.isPending}
          />
          {createPost.isError && (
            <ErrorMessage message="We couldn't publish the post. Your text is kept, please try again." />
          )}
          {createPost.isSuccess && (
            <p className="success-message" role="status">
              Post published.
            </p>
          )}
          <PostList posts={posts} />
        </>
      )}
    </section>
  )
}
