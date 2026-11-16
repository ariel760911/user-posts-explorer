import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './server.ts'

// jsdom does not implement scrolling; ScrollRestoration calls window.scrollTo.
// Not a spy on purpose: vi.restoreAllMocks() in tests must not undo it.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })

// jsdom ships <dialog> without showModal/close. Minimal polyfill: toggles the
// `open` attribute (closed dialogs are display:none in jsdom) and fires "close".
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '')
  this.dataset.modal = ''
}
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  if (!this.open) return
  this.removeAttribute('open')
  delete this.dataset.modal
  this.dispatchEvent(new Event('close'))
}

// Emulate the inert background of a modal dialog: like a real browser,
// focusing an element outside an open modal does nothing.
const nativeFocus = HTMLElement.prototype.focus
HTMLElement.prototype.focus = function focus(this: HTMLElement, options?: FocusOptions) {
  const openModal = document.querySelector('dialog[data-modal]')
  if (openModal && !openModal.contains(this)) return
  nativeFocus.call(this, options)
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())
