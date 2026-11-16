export const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Thin fetch wrapper: resolves with the parsed JSON body and rejects with
 * HttpError on non-2xx responses, so callers only handle one failure shape.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!response.ok) {
    throw new HttpError(response.status, `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
