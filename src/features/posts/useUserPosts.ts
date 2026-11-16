import { useQuery } from '@tanstack/react-query'
import { fetchUserPosts, postsKeys } from './api.ts'
import type { PostListItem } from './types.ts'

export function useUserPosts(userId: number, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<PostListItem[]>({
    queryKey: postsKeys.byUser(userId),
    queryFn: ({ signal }) => fetchUserPosts(userId, signal),
    enabled,
    // JSONPlaceholder data never changes and created posts live only in this
    // cache, so never refetch or garbage-collect it (that would drop them).
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
