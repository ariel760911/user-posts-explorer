import { useState } from 'react'
import { filterUsersByName } from './filterUsersByName.ts'
import { UserList } from './UserList.tsx'
import { UserSearch } from './UserSearch.tsx'
import { useUsers } from './useUsers.ts'

// Container: owns data fetching and search state; children stay presentational.
export function UsersPanel() {
  const { data: users, isPending, isError } = useUsers()
  const [query, setQuery] = useState('')

  const visibleUsers = users ? filterUsersByName(users, query) : []

  return (
    <section className="users-panel" aria-labelledby="users-heading">
      <h2 id="users-heading">Users</h2>
      <UserSearch value={query} onChange={setQuery} />
      {isPending && <p>Loading users…</p>}
      {isError && <p>Could not load users.</p>}
      {users &&
        (visibleUsers.length > 0 ? (
          <UserList users={visibleUsers} />
        ) : (
          <p className="empty-state">No users match “{query.trim()}”.</p>
        ))}
    </section>
  )
}
