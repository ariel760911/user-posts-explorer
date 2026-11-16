import { useQuery } from '@tanstack/react-query'
import { fetchUserPosts, postsKeys } from './api.ts'

export function useUserPosts(userId: number) {
  return useQuery({
    queryKey: postsKeys.byUser(userId),
    queryFn: ({ signal }) => fetchUserPosts(userId, signal),
  })
}
