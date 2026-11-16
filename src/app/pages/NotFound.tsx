import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="empty-state">
      <h2>Page not found</h2>
      <Link to="/">Back to users</Link>
    </div>
  )
}
