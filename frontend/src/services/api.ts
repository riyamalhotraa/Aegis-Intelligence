// Lightweight mock-API layer. Every service function returns a Promise so
// pages can exercise real loading/error/empty states without a live backend.

export function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// Occasionally simulate a transient failure so error states are reachable
// during manual testing. Disabled by default (rate 0) — flip on if desired.
export async function withFlakiness<T>(value: T, rate = 0): Promise<T> {
  if (Math.random() < rate) {
    await delay(null, 300)
    throw new ApiError('Network request failed. Please retry.')
  }
  return delay(value)
}
