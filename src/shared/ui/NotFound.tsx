import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="text-muted">
      <h2 className="mb-3 text-xl font-semibold text-fg">Page not found</h2>
      <Link to="/" className="text-accent underline hover:no-underline">
        Back to users
      </Link>
    </div>
  )
}
