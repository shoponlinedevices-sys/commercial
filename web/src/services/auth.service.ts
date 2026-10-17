import { apiClient } from '../lib/api-client';
import { LoginRequest, RegisterRequest, LoginResponse, UserInfo, RefreshResponse } from '../types';

export const AUTH_SESSION_DURATION_MS = 60 * 60 * 1000;
export const AUTH_SESSION_EXPIRES_AT_KEY = 'auth_session_expires_at';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    apiClient.setAccessToken(response.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem(AUTH_SESSION_EXPIRES_AT_KEY, String(Date.now() + AUTH_SESSION_DURATION_MS));
    }
    return response;
  },

  async register(credentials: RegisterRequest): Promise<UserInfo> {
    return await apiClient.post<UserInfo>('/auth/register', credentials);
  },

  async logout(): Promise<void> {
    apiClient.clearTokens();
  },

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refresh_token: refreshToken });
    apiClient.setAccessToken(response.access_token);
    return response;
  },

  getCurrentUser(): UserInfo | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  setCurrentUser(user: UserInfo): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      userId,
      currentPassword,
      newPassword,
    });
  },
};
