import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App.tsx'

describe('App', () => {
  it('renders the app shell with the users from the API', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /user posts explorer/i })).toBeInTheDocument()
    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
  })
})
