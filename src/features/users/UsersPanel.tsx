import { useState } from 'react'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { Loading } from '../../shared/ui/Loading.tsx'
import { filterUsersByName } from './filterUsersByName.ts'
import { UserList } from './UserList.tsx'
import { UserSearch } from './UserSearch.tsx'
import { useUsers } from './useUsers.ts'

// Container: owns data fetching and search state; children stay presentational.
export function UsersPanel() {
  const { data: users, isPending, isError, isFetching, refetch } = useUsers()
  const [query, setQuery] = useState('')

  const visibleUsers = users ? filterUsersByName(users, query) : []

  return (
    <section aria-labelledby="users-heading">
      <h2 id="users-heading" className="mb-3 text-xl font-semibold">
        Users
      </h2>
      <UserSearch value={query} onChange={setQuery} />
      {isPending && <Loading label="Loading users…" />}
      {isError && (
        <ErrorMessage
          message="We couldn't load the users. Check your connection and try again."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      )}
      {users &&
        (visibleUsers.length > 0 ? (
          <UserList users={visibleUsers} />
        ) : (
          <p className="text-muted">No users match “{query.trim()}”.</p>
        ))}
    </section>
  )
}
