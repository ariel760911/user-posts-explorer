import { request } from '../../api/httpClient.ts'
import type { Post } from '../../api/types.ts'

export const postsKeys = {
  byUser: (userId: number) => ['posts', 'user', userId] as const,
}

export function fetchUserPosts(userId: number, signal?: AbortSignal): Promise<Post[]> {
  return request<Post[]>(`/posts?userId=${userId}`, { signal })
}
