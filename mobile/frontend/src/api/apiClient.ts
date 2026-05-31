import { rawApiRequest, ApiError } from './httpClient';
import { getAccessToken, getRefreshToken, clearTokens } from './tokenStorage';
import { refreshAccessToken } from './authApi';

let isLoggingOutGlobal = false;

export function setLoggingOut(loggingOut: boolean) {
  isLoggingOutGlobal = loggingOut;
}

export async function authorizedRequest<T>(path: string, options: RequestInit = {}, baseUrl?: string): Promise<T> {
  // Prevent API calls during logout
  if (isLoggingOutGlobal) {
    const error = new Error('Cannot make API request during logout') as ApiError;
    error.status = 401;
    throw error;
  }

  const accessToken = await getAccessToken();

  // If no access token, don't make the request
  if (!accessToken) {
    const error = new Error('No access token - user not authenticated') as ApiError;
    error.status = 401;
    throw error;
  }

  const headers = {
    ...(options.headers ?? {}),
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    return await rawApiRequest<T>(path, {
      ...options,
      headers,
    }, 0, baseUrl);
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.status === 401) {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearTokens();
        throw apiError;
      }

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        return await rawApiRequest<T>(path, {
          ...options,
          headers: {
            ...(options.headers ?? {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
        }, 0, baseUrl);
      } catch (refreshError) {
        await clearTokens();
        throw refreshError;
      }
    }

    throw apiError;
  }
}
