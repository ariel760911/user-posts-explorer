import { NavLink } from 'react-router'
import type { User } from '../../api/types.ts'

interface UserListProps {
  users: User[]
}

const linkClasses =
  // min-h-11 = 44px minimum touch target (items are already taller on desktop).
  'flex min-h-11 flex-col justify-center px-3.5 py-2.5 hover:bg-surface ' +
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ' +
  'aria-[current=page]:bg-surface aria-[current=page]:font-semibold ' +
  'aria-[current=page]:shadow-[inset_3px_0_0_var(--color-accent)]'

export function UserList({ users }: UserListProps) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line" aria-label="Users">
      {users.map((user) => (
        <li key={user.id}>
          {/* NavLink sets aria-current="page" on the selected user. */}
          <NavLink to={`/users/${user.id}`} className={linkClasses}>
            <span>{user.name}</span>
            <span className="text-sm font-normal text-muted">{user.email}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
