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
  description?: string;
  image?: string;
  sku?: string;
  unit?: string;
  badge?: string;
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
