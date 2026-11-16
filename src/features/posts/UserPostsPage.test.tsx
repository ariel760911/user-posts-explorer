import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/httpClient.ts'
import { postsFixture } from '../../test/fixtures.ts'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'
import { server } from '../../test/server.ts'

describe('User posts', () => {
  it('loads the selected user posts after clicking the user', async () => {
    // Hold the response so the loading state can be asserted deterministically.
    let releaseResponse = () => {}
    const responseReleased = new Promise<void>((resolve) => {
      releaseResponse = resolve
    })
    server.use(
      http.get(`${API_BASE_URL}/posts`, async () => {
        await responseReleased
        return HttpResponse.json(postsFixture.filter((post) => post.userId === 1))
      }),
    )
    const { user, router } = renderWithProviders('/')

    await user.click(await screen.findByRole('link', { name: /Leanne Graham/ }))

    expect(router.state.location.pathname).toBe('/users/1')
    expect(await screen.findByRole('status')).toHaveTextContent('Loading posts…')
    expect(screen.getByRole('heading', { name: 'Posts by Leanne Graham' })).toBeInTheDocument()

    releaseResponse()

    const posts = within(await screen.findByRole('list', { name: 'Posts' })).getAllByRole('listitem')
    expect(posts).toHaveLength(2)
    expect(screen.getByText('First post by Leanne')).toBeInTheDocument()
    expect(screen.queryByText('First post by Ervin')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Leanne Graham/ })).toHaveAttribute('aria-current', 'page')
  })

  it('shows an error when posts fail to load and recovers on retry', async () => {
    let shouldFail = true
    server.use(
      http.get(`${API_BASE_URL}/posts`, () =>
        shouldFail
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(postsFixture.filter((post) => post.userId === 1)),
      ),
    )
    const { user } = renderWithProviders('/users/1')

    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load this user's posts")

    shouldFail = false
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('First post by Leanne')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the not-found page for an unknown user id', async () => {
    renderWithProviders('/users/999')

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
