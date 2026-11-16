import { Button } from './Button.tsx'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  isRetrying?: boolean
}

// role="alert" makes screen readers announce the error immediately.
export function ErrorMessage({ message, onRetry, isRetrying = false }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-danger bg-danger-soft px-4 py-3 text-danger" role="alert">
      <p>{message}</p>
      {onRetry && (
        <Button className="mt-2" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? 'Retrying…' : 'Try again'}
        </Button>
      )}
    </div>
  )
}
