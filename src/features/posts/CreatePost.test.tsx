import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '../../api/httpClient.ts'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'
import { server } from '../../test/server.ts'
import { SUCCESS_MESSAGE_MS } from './UserPostsPage.tsx'

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
const newPostDialog = () => screen.queryByRole('dialog', { name: 'New post' })

const userEventClick = (element: HTMLElement) => userEvent.click(element)

// jsdom does not turn Escape into the dialog "cancel" event; dispatch it directly.
function pressEscapeOnDialog() {
  fireEvent(newPostDialog() as HTMLElement, new Event('cancel', { cancelable: true }))
}
const titleField = () => screen.getByRole('textbox', { name: 'Title' })
const textField = () => screen.getByRole('textbox', { name: 'Text' })
const publishButton = () => screen.getByRole('button', { name: 'Publish post' })
const postTitles = () =>
  within(screen.getByRole('list', { name: 'Posts' }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

describe('New post modal', () => {
  it('shows the posts first, with the modal closed', async () => {
    await openUserPosts()

    expect(newPostButton()).toHaveAttribute('aria-expanded', 'false')
    expect(newPostButton()).toHaveAttribute('aria-haspopup', 'dialog')
    expect(newPostDialog()).not.toBeInTheDocument()
  })

  it('opens a labelled modal with the form and focuses the first field', async () => {
    const { user } = await openUserPosts()

    await user.click(newPostButton())

    expect(newPostButton()).toHaveAttribute('aria-expanded', 'true')
    expect(newPostDialog()).toBeVisible()
    expect(newPostDialog()).toHaveAttribute('id', newPostButton().getAttribute('aria-controls'))
    expect(within(newPostDialog() as HTMLElement).getByRole('form', { name: 'New post' })).toBeVisible()
    expect(titleField()).toHaveFocus()
  })

  it.each([
    ['the Cancel button', () => userEventClick(screen.getByRole('button', { name: 'Cancel' }))],
    ['the × button', () => userEventClick(screen.getByRole('button', { name: 'Close' }))],
    ['the Escape key', () => pressEscapeOnDialog()],
  ])('closes with %s, returns focus and keeps the draft', async (_label, close) => {
    const requests = recordPostRequests()
    const { user } = await openNewPostForm()
    await user.type(titleField(), 'Half-written idea')

    await close()

    expect(newPostDialog()).not.toBeInTheDocument()
    expect(newPostButton()).toHaveAttribute('aria-expanded', 'false')
    expect(newPostButton()).toHaveFocus()
    expect(requests).toHaveLength(0)

    await user.click(newPostButton())
    expect(titleField()).toHaveValue('Half-written idea')
  })

  it('closes when the backdrop is clicked', async () => {
    const { user } = await openNewPostForm()

    // Backdrop clicks target the <dialog> element itself.
    await user.click(newPostDialog() as HTMLElement)

    expect(newPostDialog()).not.toBeInTheDocument()
    expect(newPostButton()).toHaveFocus()
  })

  it('stays open when a text selection that started inside ends on the backdrop', async () => {
    await openNewPostForm()
    const dialog = newPostDialog() as HTMLElement

    fireEvent.pointerDown(titleField())
    fireEvent.click(dialog)

    expect(newPostDialog()).toBeVisible()
  })

  it('stays usable when the browser closes the dialog on its own', async () => {
    const { user } = await openNewPostForm()

    // e.g. a repeated Esc that the browser no longer lets us cancel.
    act(() => (newPostDialog() as HTMLDialogElement).close())

    expect(newPostButton()).toHaveAttribute('aria-expanded', 'false')
    await user.click(newPostButton())
    expect(newPostDialog()).toBeVisible()
  })

  it('closes after publishing and shows the new post on top', async () => {
    recordPostRequests()
    const { user } = await openNewPostForm()

    await user.type(titleField(), 'Fresh post')
    await user.type(textField(), 'Body')
    await user.click(publishButton())

    expect(await screen.findByRole('status')).toHaveTextContent('Post published.')
    expect(newPostDialog()).not.toBeInTheDocument()
    expect(newPostButton()).toHaveFocus()
    expect(postTitles()[0]).toBe('Fresh post')
  })

  it('hides the "Post published." confirmation after a few seconds', async () => {
    // shouldAdvanceTime keeps real time flowing for MSW and user-event.
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      recordPostRequests()
      const { user } = await openNewPostForm()
      await user.type(titleField(), 'Short-lived message')
      await user.type(textField(), 'Body')
      await user.click(publishButton())
      expect(await screen.findByText('Post published.')).toBeInTheDocument()

      act(() => vi.advanceTimersByTime(SUCCESS_MESSAGE_MS - 100))
      expect(screen.getByText('Post published.')).toBeInTheDocument()

      act(() => vi.advanceTimersByTime(200))
      expect(screen.queryByText('Post published.')).not.toBeInTheDocument()
      // The post itself stays in the list.
      expect(postTitles()[0]).toBe('Short-lived message')
    } finally {
      vi.useRealTimers()
    }
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
      'My second post',
      'My first post',
      'First post by Leanne',
      'Second post by Leanne',
    ])
    // Only locally created posts carry the badge.
    const items = within(screen.getByRole('list', { name: 'Posts' })).getAllByRole('listitem')
    expect(items.map((item) => within(item).queryByText('Not saved on server') !== null)).toEqual([
      true,
      true,
      false,
      false,
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
    expect(postTitles()).not.toContain('Will fail')
  })
})
