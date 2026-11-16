import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { NotFound } from '../../app/pages/NotFound.tsx'
import { Button } from '../../shared/ui/Button.tsx'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { Loading } from '../../shared/ui/Loading.tsx'
import { useUsers } from '../users/useUsers.ts'
import { PostForm } from './PostForm.tsx'
import { PostList } from './PostList.tsx'
import { useCreatePost } from './useCreatePost.ts'
import { useUserPosts } from './useUserPosts.ts'
import type { PostFormValues } from './validatePost.ts'

const NEW_POST_PANEL_ID = 'new-post-panel'

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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Entering a user's detail moves focus to its heading, so screen reader and
  // keyboard users start from the new content (the component is keyed by user).
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // Opening the form moves focus to its first field.
  useEffect(() => {
    if (isFormOpen) panelRef.current?.querySelector<HTMLElement>('input, textarea')?.focus()
  }, [isFormOpen])

  const user = users?.find((candidate) => candidate.id === userId)

  if (users && !user) return <NotFound />

  function toggleForm() {
    // Hide the previous "published" message when the form is reopened.
    if (!isFormOpen) createPost.reset()
    setIsFormOpen((open) => !open)
  }

  async function handleSubmit(values: PostFormValues) {
    // Rejects on failure: PostForm keeps the input and the panel stays open.
    await createPost.mutateAsync(values)
    setIsFormOpen(false)
    // The submit button disappears with the form; keep focus in a sane place.
    toggleRef.current?.focus()
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="posts-heading">
      {/* Mobile only: the user list is a separate screen there. */}
      <Link
        to="/"
        aria-label="Back to users"
        className="inline-flex min-h-11 items-center self-start text-accent underline hover:no-underline md:hidden"
      >
        ← Users
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="posts-heading" ref={headingRef} tabIndex={-1} className="text-xl font-semibold outline-none">
          {user ? `Posts by ${user.name}` : 'Posts'}
        </h2>
        {posts && (
          <Button
            ref={toggleRef}
            onClick={toggleForm}
            aria-expanded={isFormOpen}
            aria-controls={NEW_POST_PANEL_ID}
          >
            New post
          </Button>
        )}
      </div>
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
          {/* Kept mounted (hidden) so aria-controls always points to a real element. */}
          <div id={NEW_POST_PANEL_ID} ref={panelRef} hidden={!isFormOpen} className="flex flex-col gap-3">
            <PostForm onSubmit={handleSubmit} isSubmitting={createPost.isPending} />
            {createPost.isError && (
              <ErrorMessage message="We couldn't publish the post. Your text is kept, please try again." />
            )}
          </div>
          {createPost.isSuccess && (
            <p className="text-success" role="status">
              Post published.
            </p>
          )}
          <PostList posts={posts} />
        </>
      )}
    </section>
  )
}
