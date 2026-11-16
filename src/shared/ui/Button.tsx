import type { ComponentProps } from 'react'

const baseClasses =
  // min-h-11 = 44px minimum touch target on mobile; desktop keeps its size.
  'min-h-11 md:min-h-0 cursor-pointer rounded-md border px-3.5 py-1.5 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-progress disabled:opacity-65'

const variantClasses = {
  primary: 'border-accent bg-accent text-white hover:brightness-110 disabled:hover:brightness-100',
  secondary: 'border-line bg-white text-fg hover:bg-surface disabled:hover:bg-white',
} as const

interface ButtonProps extends ComponentProps<'button'> {
  variant?: keyof typeof variantClasses
}

// ComponentProps includes `ref`, which React 19 passes to function components.
export function Button({ className = '', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return <button type={type} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />
}
