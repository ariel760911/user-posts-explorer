interface LoadingProps {
  label: string
}

// role="status" makes screen readers announce the loading message.
export function Loading({ label }: LoadingProps) {
  return (
    <div className="flex items-center gap-2.5 py-3 text-muted" role="status">
      <span
        className="size-4 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}
