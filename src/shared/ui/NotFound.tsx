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
      {/* min-h-11 = 44px touch target on mobile, like the other controls. */}
      <Link
        to="/"
        className="inline-flex min-h-11 items-center text-accent underline hover:no-underline md:min-h-0"
      >
        Back to users
      </Link>
    </div>
  )
}
