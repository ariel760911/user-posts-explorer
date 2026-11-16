import type { ComponentProps } from 'react'

const baseClasses =
  // min-h-11 = 44px minimum touch target on mobile; desktop keeps its size.
  'min-h-11 md:min-h-0 cursor-pointer rounded-md border border-accent bg-accent px-3.5 py-1.5 text-white hover:brightness-110 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-progress disabled:opacity-65 disabled:hover:brightness-100'

// ComponentProps includes `ref`, which React 19 passes to function components.
export function Button({ className = '', type = 'button', ...props }: ComponentProps<'button'>) {
  return <button type={type} className={`${baseClasses} ${className}`} {...props} />
}
