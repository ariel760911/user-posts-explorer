import { request } from '../../api/httpClient.ts'
import type { NewPost, Post } from '../../api/types.ts'

export const postsKeys = {
  byUser: (userId: number) => ['posts', 'user', userId] as const,
}

export function fetchUserPosts(userId: number, signal?: AbortSignal): Promise<Post[]> {
  return request<Post[]>(`/posts?userId=${userId}`, { signal })
}

export function createPost(newPost: NewPost): Promise<Post> {
  return request<Post>('/posts', { method: 'POST', body: JSON.stringify(newPost) })
}
