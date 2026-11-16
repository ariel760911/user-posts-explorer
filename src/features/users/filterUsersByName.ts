import type { User } from '../../api/types.ts'

// Case- and accent-insensitive, so "jose" matches "José".
function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

export function filterUsersByName(users: User[], query: string): User[] {
  const needle = normalize(query)
  if (needle === '') return users

  return users.filter((user) => normalize(user.name).includes(needle))
}
