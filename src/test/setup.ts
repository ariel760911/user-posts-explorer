import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './server.ts'

// jsdom does not implement scrolling; ScrollRestoration calls window.scrollTo.
// Not a spy on purpose: vi.restoreAllMocks() in tests must not undo it.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())
