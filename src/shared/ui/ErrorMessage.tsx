interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  isRetrying?: boolean
}

// role="alert" makes screen readers announce the error immediately.
export function ErrorMessage({ message, onRetry, isRetrying = false }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? 'Retrying…' : 'Try again'}
        </button>
      )}
    </div>
  )
}
