const API_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000';

export type GatewayOrder = {
  id: string | number;
  userId: string | number;
  totalAmount: string | number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderLines?: Array<{ productId: string | number; quantity: number; unitPrice: string | number }>;
};

export type GatewayProduct = {
  id: number;
  name: string;
  price: number | string;
  oldPrice?: number | string;
  description?: string;
  image?: string;
  sku?: string;
  unit?: string;
  moq?: string;
  badge?: string;
  category?: number | string;
};

export type UserProfile = {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
};

export type FeatureSetting = {
  id: string;
  featureKey: string;
  featureName: string;
  isEnabled: boolean;
};

async function request<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && token && endpoint !== '/auth/refresh') {
    const refreshToken = localStorage.getItem('crm_refresh_token');
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (refreshResponse.ok) {
        const refreshed = await refreshResponse.json() as { access_token: string };
        localStorage.setItem('crm_access_token', refreshed.access_token);
        return request<T>(endpoint, options, refreshed.access_token);
      }
    }
    localStorage.removeItem('crm_access_token');
    localStorage.removeItem('crm_refresh_token');
    localStorage.removeItem('crm_user');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Không thể kết nối đến gateway');
  return data as T;
}

export const crmApi = {
  login(username: string, password: string) {
    return request<{ access_token: string; refresh_token: string; user: { id: number; username: string; email?: string } }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    });
  },
  getOrders(token: string, filters?: { from?: string; to?: string; statuses?: string[] }) {
    const params = new URLSearchParams();
    if (filters?.from) params.set('from', filters.from);
    if (filters?.to) params.set('to', filters.to);
    filters?.statuses?.forEach((status) => params.append('status', status));
    const query = params.toString();
    return request<GatewayOrder[]>(`/orders${query ? `?${query}` : ''}`, {}, token);
  },
  getProducts(token: string) { return request<{ products: GatewayProduct[]; total: number }>('/products', {}, token); },
  createProduct(data: Omit<GatewayProduct, 'id'>, token: string) {
    return request<{ product: GatewayProduct }>('/products', { method: 'POST', body: JSON.stringify(data) }, token);
  },
  getProfile(userId: number, token: string) { return request<UserProfile>(`/user-profile/${userId}`, {}, token); },
  updateProfile(userId: number, data: Partial<UserProfile>, token: string) {
    return request<UserProfile>(`/user-profile/${userId}`, { method: 'PUT', body: JSON.stringify(data) }, token);
  },
  getFeatureSettings(token: string) { return request<FeatureSetting[]>('/feature-settings', {}, token); },
  updateFeatureSetting(featureKey: string, isEnabled: boolean, token: string) {
    return request<FeatureSetting>(`/feature-settings/${featureKey}`, { method: 'PUT', body: JSON.stringify({ isEnabled }) }, token);
  },
  createOrder(userId: number, productId: number, totalAmount: number, quantity: number, unitPrice: number, token: string) {
    return request<GatewayOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify({ userId, totalAmount, orderLines: [{ productId, quantity, unitPrice }] }),
    }, token);
  },
  updateStatus(id: string, status: string, token: string) {
    return request<GatewayOrder>(`/orders/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }, token);
  },
};
