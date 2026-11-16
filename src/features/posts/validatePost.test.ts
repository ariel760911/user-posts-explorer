import { describe, expect, it } from 'vitest'
import { hasErrors, validatePost } from './validatePost.ts'

describe('validatePost', () => {
  it('requires both title and text', () => {
    expect(validatePost({ title: '', body: '' })).toEqual({
      title: 'Title is required.',
      body: 'Text is required.',
    })
  })

  it('treats whitespace-only values as empty', () => {
    expect(validatePost({ title: '   ', body: '\n\t' })).toEqual({
      title: 'Title is required.',
      body: 'Text is required.',
    })
  })

  it('accepts a post with title and text', () => {
    const errors = validatePost({ title: 'Hello', body: 'World' })

    expect(errors).toEqual({})
    expect(hasErrors(errors)).toBe(false)
  })
})
