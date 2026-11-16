import type { RequestHandler } from 'msw'

// Default API handlers. Each feature adds its endpoints here;
// individual tests override them with server.use(...).
export const handlers: RequestHandler[] = []
