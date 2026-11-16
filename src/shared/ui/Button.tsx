import type { ButtonHTMLAttributes } from 'react'

const baseClasses =
  'cursor-pointer rounded-md border border-accent bg-accent px-3.5 py-1.5 text-white hover:brightness-110 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-progress disabled:opacity-65 disabled:hover:brightness-100'

export function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`${baseClasses} ${className}`} {...props} />
}
