import { API_BASE_URL } from './api-config';

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || this.accessToken;
    }
    return this.accessToken;
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customBaseUrl?: string
  ): Promise<T> {
    const baseUrl = customBaseUrl || API_BASE_URL;
    const url = `${baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || response.statusText || 'API request failed');
    }

    return data as T;
  }

  async get<T>(endpoint: string, customBaseUrl?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, customBaseUrl);
  }

  async post<T>(endpoint: string, body: any, customBaseUrl?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, customBaseUrl);
  }

  async put<T>(endpoint: string, body: any, customBaseUrl?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, customBaseUrl);
  }

  async delete<T>(endpoint: string, customBaseUrl?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, customBaseUrl);
  }
}

export const apiClient = new ApiClient();
