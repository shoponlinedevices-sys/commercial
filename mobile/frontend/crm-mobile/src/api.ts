import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = (process.env.EXPO_PUBLIC_GATEWAY_URL || 'https://api.thegioithietbi.online').replace(/\/$/, '');
const ACCESS_TOKEN_KEY = 'crm_access_token';
const REFRESH_TOKEN_KEY = 'crm_refresh_token';
const USER_KEY = 'crm_user';

export type User = { id: number; username: string; email?: string; role?: string };
export type Profile = User & { full_name?: string; phone?: string };
export type Product = {
  id: number; name: string; price: number | string; oldPrice?: number | string; description?: string;
  image?: string; sku?: string; unit?: string; moq?: string; badge?: string; category?: number | string;
};
export type Order = {
  id: string | number; userId: string | number; totalAmount: string | number; status: string;
  createdAt: string; updatedAt: string;
  orderLines?: Array<{ productId: string | number; quantity: number; unitPrice: string | number }>;
};
export type Supplier = {
  id: number; name: string; phone: string | null; email: string | null; address: string | null;
  taxCode: string | null; note: string | null; status: number; createdAt: string; updatedAt: string;
};
export type InventoryItem = {
  id: number; productId: number; productName: string; sku: string; category: string;
  quantityOnHand: number; quantityReserved: number; reorderLevel: number; unitPrice: number;
  quantityAvailable: number; status: 'Còn hàng' | 'Sắp hết hàng' | 'Hết hàng'; updatedAt: string;
};
export type InventorySummary = {
  totalProducts: number; totalOnHand: number; lowStockItems: number; outOfStockItems: number;
  inventoryValue: number; hasCostData: boolean;
};
export type FeatureSetting = { id: string; featureKey: string; featureName: string; isEnabled: boolean };
export type HistoryLog = {
  id: string | number; action: string; entityType: string; entityId: string;
  source: string; createdBy: string; metadata?: Record<string, unknown>; createdAt: string;
};
export type ProductCost = {
  id: string; productId: number; productName: string; sku?: string; salePrice: number;
  supplierId: number | null; supplierName: string | null; importPrice: number; quantity: number;
  shippingFee: number; otherFee: number; totalGoods: number; totalFees: number; totalValue: number;
  unitCost: number; expectedProfit: number; profitMarginPercent: number | null;
  importDate: string; note: string | null; createdAt: string;
};
export type ViewEvent = {
  viewEventId: string; entityType: 'category' | 'brand' | 'product'; entityId: string;
  entityName: string; visitorId: string; sessionId: string; userId: string;
  pageUrl: string; referrerUrl: string; viewedAt: string;
};
export type ViewStats = {
  totalViews: string; uniqueVisitors: string;
  topEntities: Array<{ entityType: string; entityId: string; entityName: string; views: string; uniqueVisitors: string }>;
  dailyViews: Array<{ date: string; views: string }>;
};

async function request<T>(path: string, token?: string, init: RequestInit = {}, canRefresh = true): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (response.status === 401 && token && canRefresh && path !== '/auth/refresh') {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        const refreshed = await request<{ access_token: string }>('/auth/refresh', undefined, {
          method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }),
        }, false);
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, refreshed.access_token);
        return request<T>(path, refreshed.access_token, init, false);
      } catch (refreshError) {
        await clearSession();
        throw new Error(`Unauthorized: phiên đăng nhập hết hạn. ${refreshError instanceof Error ? refreshError.message : ''}`.trim());
      }
    }
    await clearSession();
  }

  const body = await response.text();
  let data: { message?: string } | null = null;
  if (body) {
    try { data = JSON.parse(body) as { message?: string }; } catch { data = null; }
  }
  if (!response.ok) throw new Error(data?.message || `Yêu cầu thất bại (${response.status})`);
  return (body ? JSON.parse(body) : null) as T;
}

function queryString(values: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function saveSession(accessToken: string, refreshToken: string, user: User): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function loadSession(): Promise<{ token: string; user: User } | null> {
  const values = await AsyncStorage.multiGet([ACCESS_TOKEN_KEY, USER_KEY]);
  const token = values[0][1];
  const rawUser = values[1][1];
  if (!token || !rawUser) return null;
  try { return { token, user: JSON.parse(rawUser) as User }; }
  catch { await clearSession(); return null; }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
}

export const crmApi = {
  login: (username: string, password: string) => request<{ access_token: string; refresh_token: string; user: User }>('/auth/login', undefined, { method: 'POST', body: JSON.stringify({ username, password }) }),
  getOrders: (token: string, filters: { from?: string; to?: string; statuses?: string[] } = {}) => {
    const params = new URLSearchParams();
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    filters.statuses?.forEach((value) => params.append('status', value));
    const query = params.toString();
    return request<Order[]>(`/orders${query ? `?${query}` : ''}`, token);
  },
  getProducts: (token: string) => request<{ products: Product[]; total: number }>('/products', token),
  getProfile: (token: string, id: number) => request<Profile>(`/user-profile/${id}`, token),
  updateProfile: (token: string, id: number, data: Partial<Profile>) => request<Profile>(`/user-profile/${id}`, token, { method: 'PUT', body: JSON.stringify(data) }),
  getFeatureSettings: (token: string) => request<FeatureSetting[]>('/feature-settings', token),
  updateFeatureSetting: (token: string, key: string, isEnabled: boolean) => request<FeatureSetting>(`/feature-settings/${key}`, token, { method: 'PUT', body: JSON.stringify({ isEnabled }) }),
  updateStatus: (token: string, id: string | number, status: string) => request<Order>(`/orders/${id}/status`, token, { method: 'POST', body: JSON.stringify({ status }) }),
  createOrder: (token: string, userId: number, productId: number, totalAmount: number, quantity: number) => request<Order>('/orders', token, { method: 'POST', body: JSON.stringify({ userId, totalAmount, orderLines: [{ productId, quantity, unitPrice: Math.round(totalAmount / quantity) }] }) }),
  createProduct: (token: string, product: Omit<Product, 'id'>) => request<{ product: Product }>('/products', token, { method: 'POST', body: JSON.stringify(product) }),
  getInventorySummary: (token: string) => request<InventorySummary>('/inventory/summary', token),
  getInventory: (token: string, page = 1, limit = 30) => request<{ items: InventoryItem[]; total: number; page: number; limit: number }>(`/inventory${queryString({ page, limit })}`, token),
  inventoryAction: (token: string, action: 'import' | 'adjust' | 'reserve' | 'release' | 'sale' | 'return', data: Record<string, unknown>) => {
    const paths = { import: '/inventory/import', adjust: '/inventory/adjustments', reserve: '/inventory/reserve', release: '/inventory/release', sale: '/inventory/sale', return: '/inventory/return' };
    return request<unknown>(paths[action], token, { method: 'POST', body: JSON.stringify(data) });
  },
  getSuppliers: (token: string, filters: { search?: string; status?: number; page?: number; limit?: number } = {}) => request<{ items: Supplier[]; total: number; page: number; limit: number }>(`/suppliers${queryString(filters)}`, token),
  getSupplier: (token: string, id: number) => request<Supplier>(`/suppliers/${id}`, token),
  saveSupplier: (token: string, data: Partial<Supplier>, id?: number) => request<Supplier>(id ? `/suppliers/${id}` : '/suppliers', token, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(data) }),
  setSupplierStatus: (token: string, id: number, status: number) => request<Supplier>(`/suppliers/${id}/status`, token, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getCostSummary: (token: string) => request<{ totalImports: number; totalValue: number; productsWithCost: number }>('/product-costs/summary', token),
  getProductCosts: (token: string, filters: Record<string, string | number | undefined> = {}) => request<{ items: ProductCost[]; total: number; page: number; limit: number }>(`/product-costs${queryString(filters)}`, token),
  getProductCost: (token: string, id: string) => request<ProductCost>(`/product-costs/${encodeURIComponent(id)}`, token),
  getLatestCost: (token: string, productId: number) => request<{ item: ProductCost | null }>(`/product-costs/product/${productId}/latest`, token),
  saveCost: (token: string, data: Record<string, unknown>, id?: string) => request<ProductCost>(id ? `/product-costs/${encodeURIComponent(id)}` : '/product-costs', token, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(data) }),
  getHistoryLogs: (token: string) => request<HistoryLog[]>('/history-logs?limit=500', token),
  getViewEvents: (token: string, filters: Record<string, string | number | undefined>) => request<{ items: ViewEvent[]; total: string; page: number; limit: number }>(`/view-events${queryString(filters)}`, token),
  getViewStats: (token: string, filters: Record<string, string | undefined>) => request<ViewStats>(`/view-events/stats${queryString(filters)}`, token),
  getOnlinePresence: (token: string) => request<{ activeVisitors: number }>('/view-events/presence/online', token),
  getHourlyPresence: (token: string, date: string) => request<{ date: string; samples: Array<{ hour: number; activeVisitors: number }> }>(`/view-events/presence/hourly?date=${encodeURIComponent(date)}`, token),
  getHourlyPresenceRange: (token: string, from: string, to: string) => request<{ samples: Array<{ date: string; hour: number; activeVisitors: number }> }>(`/view-events/presence/hourly/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, token),
};
