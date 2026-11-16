import { useRef, useState, type FormEvent } from 'react'
import { hasErrors, validatePost, type PostFormErrors, type PostFormValues } from './validatePost.ts'

const EMPTY_VALUES: PostFormValues = { title: '', body: '' }

function RequiredMark() {
  return (
    <span className="required-mark" aria-hidden="true">
      *
    </span>
  )
}

interface PostFormProps {
  /** Receives trimmed values. Resolve to reset the form; reject to keep the input. */
  onSubmit: (values: PostFormValues) => Promise<void>
  isSubmitting?: boolean
}

export function PostForm({ onSubmit, isSubmitting = false }: PostFormProps) {
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
    <form className="post-form" aria-labelledby="post-form-heading" noValidate onSubmit={handleSubmit}>
      <h3 id="post-form-heading">New post</h3>
      {/* The visual asterisk is aria-hidden; `required` conveys it to assistive tech. */}
      <p className="form-hint">
        Fields marked with <RequiredMark /> are required.
      </p>

      <div className="form-field">
        <label htmlFor="post-title">
          Title <RequiredMark />
        </label>
        <input
          ref={titleRef}
          id="post-title"
          name="title"
          required
          value={values.title}
          onChange={(event) => handleChange('title', event.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
        />
        {errors.title && (
          <p id="post-title-error" className="form-field__error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="post-body">
          Text <RequiredMark />
        </label>
        <textarea
          ref={bodyRef}
          id="post-body"
          name="body"
          rows={4}
          required
          value={values.body}
          onChange={(event) => handleChange('body', event.target.value)}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
        />
        {errors.body && (
          <p id="post-body-error" className="form-field__error">
            {errors.body}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Publishing…' : 'Publish post'}
      </button>
    </form>
  )
}
