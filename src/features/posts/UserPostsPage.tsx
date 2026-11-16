import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { NotFound } from '../../shared/ui/NotFound.tsx'
import { Button } from '../../shared/ui/Button.tsx'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { Loading } from '../../shared/ui/Loading.tsx'
import { Modal } from '../../shared/ui/Modal.tsx'
import { useUsers } from '../users/useUsers.ts'
import { PostForm } from './PostForm.tsx'
import { PostList } from './PostList.tsx'
import { useCreatePost } from './useCreatePost.ts'
import { useUserPosts } from './useUserPosts.ts'
import type { PostFormValues } from './validatePost.ts'

const NEW_POST_DIALOG_ID = 'new-post-dialog'
const NEW_POST_TITLE_ID = 'new-post-title'

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
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Entering a user's detail moves focus to its heading, so screen reader and
  // keyboard users start from the new content (the component is keyed by user).
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const user = users?.find((candidate) => candidate.id === userId)

  if (users && !user) return <NotFound />

  function openForm() {
    // Hide the previous "published" message and any stale error.
    createPost.reset()
    setIsFormOpen(true)
  }

  // Modal restores focus to "New post" once the dialog is really closed.
  function closeForm() {
    setIsFormOpen(false)
  }

  async function handleSubmit(values: PostFormValues) {
    // Rejects on failure: PostForm keeps the input and the modal stays open.
    await createPost.mutateAsync(values)
    closeForm()
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
            onClick={openForm}
            aria-haspopup="dialog"
            aria-expanded={isFormOpen}
            aria-controls={NEW_POST_DIALOG_ID}
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
          {/* Always mounted: aria-controls stays valid and a draft survives closing. */}
          <Modal
            id={NEW_POST_DIALOG_ID}
            title="New post"
            titleId={NEW_POST_TITLE_ID}
            open={isFormOpen}
            onClose={closeForm}
          >
            <div className="flex flex-col gap-3">
              {createPost.isError && (
                <ErrorMessage message="We couldn't publish the post. Your text is kept, please try again." />
              )}
              <PostForm
                labelledBy={NEW_POST_TITLE_ID}
                onSubmit={handleSubmit}
                onCancel={closeForm}
                isSubmitting={createPost.isPending}
              />
            </div>
          </Modal>
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
