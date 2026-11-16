export interface PostFormValues {
  title: string
  body: string
}

export type PostFormErrors = Partial<Record<keyof PostFormValues, string>>

// Pure validation: whitespace-only values count as empty.
export function validatePost(values: PostFormValues): PostFormErrors {
  const errors: PostFormErrors = {}

  if (values.title.trim() === '') errors.title = 'Title is required.'
  if (values.body.trim() === '') errors.body = 'Text is required.'

  return errors
}

export function hasErrors(errors: PostFormErrors): boolean {
  return Object.keys(errors).length > 0
}
