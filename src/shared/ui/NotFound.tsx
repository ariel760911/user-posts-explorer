import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

export function NotFound() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // NotFound can replace content that had focus (e.g. an unknown user id
  // resolves after loading); move focus here so it is not lost to <body>.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="text-muted">
      <h2 ref={headingRef} tabIndex={-1} className="mb-3 text-xl font-semibold text-fg outline-none">
        Page not found
      </h2>
      <Link to="/" className="text-accent underline hover:no-underline">
        Back to users
      </Link>
    </div>
  )
}
