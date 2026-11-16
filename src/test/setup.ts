import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './server.ts'

// jsdom does not implement scrolling; ScrollRestoration calls window.scrollTo.
// Not a spy on purpose: vi.restoreAllMocks() in tests must not undo it.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })

// jsdom ships <dialog> without showModal/close. Minimal polyfill: toggles the
// `open` attribute (closed dialogs are display:none in jsdom) and fires "close".
// Browser-only behaviour (focus trap, inert background) is not emulated.
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())
