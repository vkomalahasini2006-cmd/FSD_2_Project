export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://rentkart-api-871t.onrender.com/api';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 && token) {
    window.dispatchEvent(new Event('rentkart:auth-expired'));
  }

  if (response.status === 204) {
    if (!response.ok) throw new ApiError('Request failed', response.status);
    return undefined as T;
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    if (response.ok) throw new ApiError('The server returned an invalid response', response.status);
    result = null;
  }
  if (!response.ok) {
    const message = typeof result === 'object' && result !== null && 'message' in result && typeof result.message === 'string'
      ? result.message
      : (typeof result === 'object' && result !== null && 'error' in result && typeof result.error === 'object' && result.error && 'message' in result.error && typeof result.error.message === 'string')
        ? result.error.message
        : 'Request failed. Please try again.';
    throw new ApiError(message, response.status);
  }

  // Handle ApiResponse standard wrapper ({ success: true, data: { ... } })
  if (result && typeof result === 'object' && 'data' in result && result.data !== undefined) {
    return result.data as T;
  }

  return result as T;
}
