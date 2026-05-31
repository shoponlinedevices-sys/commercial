import { rawApiRequest } from './httpClient';
import { clearTokens, setAccessToken, setTokens } from './tokenStorage';
import { AUTH_SERVICE_BASE_URL } from './config';

export type UserInfo = {
  id: number;
  username: string;
  email?: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
};

export async function login(username: string, password: string): Promise<UserInfo> {
  const response = await rawApiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }, 0, AUTH_SERVICE_BASE_URL);

  await setTokens(response.access_token, response.refresh_token);
  return response.user;
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await rawApiRequest<{ access_token: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  }, 0, AUTH_SERVICE_BASE_URL);

  await setAccessToken(response.access_token);
  return response.access_token;
}

export async function logout(): Promise<void> {
  await clearTokens();
}

export async function register(username: string, password: string): Promise<UserInfo> {
  const response = await rawApiRequest<UserInfo>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }, 0, AUTH_SERVICE_BASE_URL);
  return response;
}
