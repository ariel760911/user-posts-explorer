import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '../../api/httpClient.ts'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'
import { server } from '../../test/server.ts'

// Mirrors JSONPlaceholder (always id 101) and records what the app sends.
function recordPostRequests() {
  const bodies: unknown[] = []
  server.use(
    http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>
      bodies.push(body)
      return HttpResponse.json({ ...body, id: 101 }, { status: 201 })
    }),
  )
  return bodies
}

async function openUserPosts() {
  const rendered = renderWithProviders('/users/1')
  await screen.findByText('First post by Leanne')
  return rendered
}

async function openNewPostForm() {
  const rendered = await openUserPosts()
  await rendered.user.click(newPostButton())
  return rendered
}

const newPostButton = () => screen.getByRole('button', { name: 'New post' })
const newPostForm = () => screen.queryByRole('form', { name: 'New post' })
const titleField = () => screen.getByRole('textbox', { name: 'Title' })
const textField = () => screen.getByRole('textbox', { name: 'Text' })
const publishButton = () => screen.getByRole('button', { name: 'Publish post' })
const postTitles = () =>
  within(screen.getByRole('list', { name: 'Posts' }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

describe('New post toggle', () => {
  it('shows the posts first, with the form closed', async () => {
    await openUserPosts()

    expect(newPostButton()).toHaveAttribute('aria-expanded', 'false')
    expect(newPostForm()).not.toBeInTheDocument()
  })

  it('opens and closes the form, pointing aria-controls at it', async () => {
    const { user } = await openUserPosts()

    await user.click(newPostButton())

    expect(newPostButton()).toHaveAttribute('aria-expanded', 'true')
    expect(newPostForm()).toBeVisible()
    expect(titleField()).toHaveFocus()
    const panelId = newPostButton().getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    expect(document.getElementById(panelId ?? '')).toContainElement(newPostForm())

    await user.click(newPostButton())

    expect(newPostButton()).toHaveAttribute('aria-expanded', 'false')
    expect(newPostForm()).not.toBeInTheDocument()
  })

  it('closes the form after publishing and shows the new post on top', async () => {
    recordPostRequests()
    const { user } = await openNewPostForm()

    await user.type(titleField(), 'Fresh post')
    await user.type(textField(), 'Body')
    await user.click(publishButton())

    expect(await screen.findByRole('status')).toHaveTextContent('Post published.')
    expect(newPostButton()).toHaveAttribute('aria-expanded', 'false')
    expect(newPostForm()).not.toBeInTheDocument()
    expect(newPostButton()).toHaveFocus()
    expect(postTitles()[0]).toBe('Fresh postNot saved on server')
  })
})

describe('Create post', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows required errors and does not call the API when fields are empty', async () => {
    const requests = recordPostRequests()
    const { user } = await openNewPostForm()

    await user.type(textField(), '   ')
    await user.click(publishButton())

    expect(titleField()).toHaveAccessibleDescription('Title is required.')
    expect(textField()).toHaveAccessibleDescription('Text is required.')
    expect(titleField()).toHaveAttribute('aria-invalid', 'true')
    expect(titleField()).toHaveFocus()
    expect(requests).toHaveLength(0)

    await user.type(titleField(), 'Now it has a title')

    expect(titleField()).not.toHaveAccessibleDescription()
  })

  it('adds new posts to the top of the list, marked as local, and resets the form', async () => {
    // React reports duplicate keys through console.error.
    const consoleError = vi.spyOn(console, 'error')
    const requests = recordPostRequests()
    const { user } = await openNewPostForm()

    await user.type(titleField(), '  My first post ')
    await user.type(textField(), 'Hello world')
    await user.click(publishButton())

    expect(await screen.findByRole('status')).toHaveTextContent('Post published.')
    expect(requests).toEqual([{ title: 'My first post', body: 'Hello world', userId: 1 }])

    // The API answers id 101 every time: a second post must not clash.
    await user.click(newPostButton())
    expect(titleField()).toHaveValue('')
    expect(textField()).toHaveValue('')
    await user.type(titleField(), 'My second post')
    await user.type(textField(), 'Again')
    await user.click(publishButton())

    await screen.findByText('My second post')
    expect(postTitles()).toEqual([
      'My second postNot saved on server',
      'My first postNot saved on server',
      'First post by Leanne',
      'Second post by Leanne',
    ])
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('keeps the form open with the input and shows an error when publishing fails', async () => {
    server.use(http.post(`${API_BASE_URL}/posts`, () => new HttpResponse(null, { status: 500 })))
    const { user } = await openNewPostForm()

    await user.type(titleField(), 'Will fail')
    await user.type(textField(), 'Body')
    await user.click(publishButton())

    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't publish the post")
    expect(newPostButton()).toHaveAttribute('aria-expanded', 'true')
    expect(titleField()).toHaveValue('Will fail')
    expect(postTitles()).not.toContain('Will failNot saved on server')
  })
})
