import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'

function userLinks() {
  return within(screen.getByRole('list', { name: 'Users' })).getAllByRole('link')
}

describe('Users search', () => {
  it('filters the user list by name as the user types', async () => {
    const { user } = renderWithProviders('/')

    await screen.findByRole('list', { name: 'Users' })
    expect(userLinks()).toHaveLength(3)

    await user.type(screen.getByRole('searchbox', { name: 'Search by name' }), 'ervin')

    expect(userLinks()).toHaveLength(1)
    expect(userLinks()[0]).toHaveAccessibleName(/Ervin Howell/)
  })

  it('shows a message when no user matches and restores the list when cleared', async () => {
    const { user } = renderWithProviders('/')
    await screen.findByRole('list', { name: 'Users' })
    const search = screen.getByRole('searchbox', { name: 'Search by name' })

    await user.type(search, 'nobody')

    expect(screen.queryByRole('list', { name: 'Users' })).not.toBeInTheDocument()
    expect(screen.getByText('No users match “nobody”.')).toBeInTheDocument()

    await user.clear(search)

    expect(userLinks()).toHaveLength(3)
  })

  it('announces the number of results to screen readers', async () => {
    const { user } = renderWithProviders('/')
    await screen.findByRole('list', { name: 'Users' })
    const search = screen.getByRole('searchbox', { name: 'Search by name' })
    const announcement = screen.getByTestId('search-results-announcement')

    expect(announcement).toHaveAttribute('aria-live', 'polite')
    expect(announcement).toBeEmptyDOMElement()

    await user.type(search, 'ervin')
    expect(announcement).toHaveTextContent('1 user found')

    await user.clear(search)
    await user.type(search, 'e')
    expect(announcement).toHaveTextContent('3 users found')

    await user.type(search, 'zzz')
    expect(announcement).toHaveTextContent('No users found')
  })
})
