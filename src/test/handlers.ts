import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '../api/httpClient.ts'
import { usersFixture } from './fixtures.ts'

// Default API handlers. Individual tests override them with server.use(...).
export const handlers = [http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(usersFixture))]
