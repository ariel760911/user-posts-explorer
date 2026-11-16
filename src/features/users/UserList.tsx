import type { User } from '../../api/types.ts'

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  return (
    <ul className="user-list" aria-label="Users">
      {users.map((user) => (
        <li key={user.id} className="user-list__item">
          <span className="user-list__name">{user.name}</span>
          <span className="user-list__email">{user.email}</span>
        </li>
      ))}
    </ul>
  )
}
