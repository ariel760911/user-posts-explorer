import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, postsKeys } from './api.ts'
import type { PostListItem } from './types.ts'
import type { PostFormValues } from './validatePost.ts'

// JSONPlaceholder answers every POST with id 101, which would duplicate React
// keys after the second post. Negative local ids never collide with real ones.
let lastLocalId = 0
function nextLocalId(): number {
  lastLocalId -= 1
  return lastLocalId
}

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PostFormValues) => createPost({ ...values, userId }),
    onSuccess: (created) => {
      const localPost: PostListItem = { ...created, id: nextLocalId(), isLocal: true }
      // The API does not persist the post, so insert it into the cached list.
      queryClient.setQueryData<PostListItem[]>(postsKeys.byUser(userId), (current = []) => [
        localPost,
        ...current,
      ])
    },
  })
}
