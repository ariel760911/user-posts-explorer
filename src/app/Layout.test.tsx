import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders.tsx'

// jsdom does not evaluate media queries, so the mobile behaviour is asserted
// through the responsive classes that drive it.
const mobileHidden = ['hidden', 'md:block']

describe('Mobile list/detail navigation', () => {
  it('shows only the user list on mobile at the home route', async () => {
    renderWithProviders('/')
    await screen.findByRole('list', { name: 'Users' })

    expect(screen.getByRole('complementary')).not.toHaveClass(...mobileHidden)
    expect(screen.getByRole('main')).toHaveClass(...mobileHidden)
  })

  it('shows only the user detail on mobile when a user is selected', async () => {
    renderWithProviders('/users/1')
    await screen.findByText('First post by Leanne')

    expect(screen.getByRole('complementary')).toHaveClass(...mobileHidden)
    expect(screen.getByRole('main')).not.toHaveClass(...mobileHidden)
  })

  it('keeps the not-found page visible on mobile for unknown routes', async () => {
    renderWithProviders('/does-not-exist')

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('main')).not.toHaveClass(...mobileHidden)
  })

  it('"← Users" link goes back to the user list', async () => {
    const { user, router } = renderWithProviders('/users/1')
    await screen.findByText('First post by Leanne')

    const backLink = screen.getByRole('link', { name: 'Back to users' })
    expect(backLink).toHaveTextContent('← Users')
    expect(backLink).toHaveClass('md:hidden')

    await user.click(backLink)

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByText('Select a user to see their posts.')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveClass(...mobileHidden)
  })
})

describe('Thumb-friendly details', () => {
  it('scrolls to the top and focuses the posts heading when entering a user', async () => {
    const { user } = renderWithProviders('/')
    await screen.findByRole('list', { name: 'Users' })
    vi.mocked(window.scrollTo).mockClear()

    await user.click(screen.getByRole('link', { name: /Ervin Howell/ }))

    const heading = await screen.findByRole('heading', { name: 'Posts by Ervin Howell' })
    expect(heading).toHaveFocus()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('moves focus to the new heading when switching between users', async () => {
    const { user } = renderWithProviders('/users/1')
    await screen.findByRole('heading', { name: 'Posts by Leanne Graham' })

    await user.click(screen.getByRole('link', { name: /Ervin Howell/ }))

    expect(await screen.findByRole('heading', { name: 'Posts by Ervin Howell' })).toHaveFocus()
  })

  // jsdom has no layout engine: touch size and stickiness are asserted via classes.
  it('gives list items and buttons a 44px minimum touch target', async () => {
    renderWithProviders('/users/1')
    await screen.findByText('First post by Leanne')

    for (const link of within(screen.getByRole('list', { name: 'Users' })).getAllByRole('link')) {
      expect(link).toHaveClass('min-h-11')
    }
    expect(screen.getByRole('button', { name: 'New post' })).toHaveClass('min-h-11')
    expect(screen.getByRole('link', { name: 'Back to users' })).toHaveClass('min-h-11')
  })

  it('gives the not-found "Back to users" link a 44px touch target', async () => {
    renderWithProviders('/users/abc')

    await screen.findByRole('heading', { name: 'Page not found' })
    expect(screen.getByRole('link', { name: 'Back to users' })).toHaveClass('min-h-11')
  })

  it('keeps the user search sticky at the top on mobile only', async () => {
    renderWithProviders('/')
    const search = await screen.findByRole('searchbox', { name: 'Search by name' })

    expect(search.parentElement).toHaveClass('sticky', 'top-0', 'md:static')
  })
})
