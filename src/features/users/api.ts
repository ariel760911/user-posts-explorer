import { request } from '../../api/httpClient.ts'
import type { User } from '../../api/types.ts'

export const usersKeys = {
  all: ['users'] as const,
}

export function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  return request<User[]>('/users', { signal })
}
