import { UserList } from './UserList.tsx'
import { useUsers } from './useUsers.ts'

// Container: owns data fetching; UserList stays presentational.
export function UsersPanel() {
  const { data: users, isPending, isError } = useUsers()

  return (
    <section className="users-panel" aria-labelledby="users-heading">
      <h2 id="users-heading">Users</h2>
      {isPending && <p>Loading users…</p>}
      {isError && <p>Could not load users.</p>}
      {users && <UserList users={users} />}
    </section>
  )
}
