import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
