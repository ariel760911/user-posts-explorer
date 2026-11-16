interface LoadingProps {
  label: string
}

// role="status" makes screen readers announce the loading message.
export function Loading({ label }: LoadingProps) {
  return (
    <div className="loading" role="status">
      <span className="loading__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
