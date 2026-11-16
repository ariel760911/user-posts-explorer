import { NavLink } from 'react-router'
import type { User } from '../../api/types.ts'

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  return (
    <ul className="user-list" aria-label="Users">
      {users.map((user) => (
        <li key={user.id}>
          {/* NavLink sets aria-current="page" on the selected user. */}
          <NavLink to={`/users/${user.id}`} className="user-list__item">
            <span className="user-list__name">{user.name}</span>
            <span className="user-list__email">{user.email}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
