import { useQuery } from '@tanstack/react-query'
import { fetchUsers, usersKeys } from './api.ts'

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: ({ signal }) => fetchUsers(signal),
  })
}
