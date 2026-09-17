const rawBaseUrl = (import.meta.env.VITE_API_URL as string) || 'https://refreshing-recreation-production-85e2.up.railway.app';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanBaseUrl.endsWith('/api/v1') ? cleanBaseUrl : `${cleanBaseUrl}/api/v1`;

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem('tutortrack_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('tutortrack_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('tutortrack_token');
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 2
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return apiFetch<T>(endpoint, options, retries - 1);
    }
    throw networkError;
  }

  // Handle transient server errors like 502 Bad Gateway during Railway container wake-ups
  if ((response.status === 502 || response.status === 503 || response.status === 504) && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return apiFetch<T>(endpoint, options, retries - 1);
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      (response.status === 502
        ? 'Backend service is waking up (502 Bad Gateway). Please try again in a moment.'
        : `Request failed with status ${response.status}`);
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}
