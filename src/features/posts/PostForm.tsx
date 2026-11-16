import { useRef, useState, type FormEvent } from 'react'
import { Button } from '../../shared/ui/Button.tsx'
import { fieldControl } from '../../shared/ui/fieldControl.ts'
import { hasErrors, validatePost, type PostFormErrors, type PostFormValues } from './validatePost.ts'

const EMPTY_VALUES: PostFormValues = { title: '', body: '' }

function RequiredMark() {
  return (
    <span className="font-semibold text-danger" aria-hidden="true">
      *
    </span>
  )
}

interface PostFormProps {
  /** Receives trimmed values. Resolve to reset the form; reject to keep the input. */
  onSubmit: (values: PostFormValues) => Promise<void>
  /** Renders a Cancel button when provided. */
  onCancel?: () => void
  isSubmitting?: boolean
}

export function PostForm({ onSubmit, onCancel, isSubmitting = false }: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<PostFormErrors>({})
  // Errors show after the first submit attempt, then update while typing.
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  function handleChange(field: keyof PostFormValues, value: string) {
    const next = { ...values, [field]: value }
    setValues(next)
    if (submitAttempted) setErrors(validatePost(next))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitAttempted(true)

    const validationErrors = validatePost(values)
    setErrors(validationErrors)

    if (hasErrors(validationErrors)) {
      // Move focus to the first invalid field so keyboard users land on it.
      if (validationErrors.title) titleRef.current?.focus()
      else bodyRef.current?.focus()
      return
    }

    try {
      await onSubmit({ title: values.title.trim(), body: values.body.trim() })
      setValues(EMPTY_VALUES)
      setErrors({})
      setSubmitAttempted(false)
    } catch {
      // The parent renders the submission error; keep the user's input.
    }
  }

  return (
    // Unnamed on purpose: the enclosing dialog already carries the "New post"
    // name; naming the form too made screen readers announce it twice.
    <form className="grid gap-3.5" noValidate onSubmit={handleSubmit}>
      {/* The visual asterisk is aria-hidden; `required` conveys it to assistive tech. */}
      <p className="text-sm text-muted">
        Fields marked with <RequiredMark /> are required.
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="post-title">
          Title <RequiredMark />
        </label>
        <input
          ref={titleRef}
          id="post-title"
          name="title"
          required
          className={fieldControl}
          value={values.title}
          onChange={(event) => handleChange('title', event.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
        />
        {errors.title && (
          <p id="post-title-error" className="text-sm text-danger">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="post-body">
          Text <RequiredMark />
        </label>
        <textarea
          ref={bodyRef}
          id="post-body"
          name="body"
          rows={4}
          required
          className={`${fieldControl} resize-y`}
          value={values.body}
          onChange={(event) => handleChange('body', event.target.value)}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
        />
        {errors.body && (
          <p id="post-body-error" className="text-sm text-danger">
            {errors.body}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing…' : 'Publish post'}
        </Button>
      </div>
    </form>
  )
}
