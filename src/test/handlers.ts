import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '../api/httpClient.ts'
import { postsFixture, usersFixture } from './fixtures.ts'

// Default API handlers. Individual tests override them with server.use(...).
export const handlers = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(usersFixture)),
  http.get(`${API_BASE_URL}/posts`, ({ request }) => {
    const userId = Number(new URL(request.url).searchParams.get('userId'))
    return HttpResponse.json(postsFixture.filter((post) => post.userId === userId))
  }),
  // Mirrors JSONPlaceholder: echoes the body and always answers with id 101.
  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...body, id: 101 }, { status: 201 })
  }),
]
