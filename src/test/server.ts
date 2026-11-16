import { setupServer } from 'msw/node'
import { handlers } from './handlers.ts'

// Network-level mock: tests exercise the real fetch code path.
export const server = setupServer(...handlers)
