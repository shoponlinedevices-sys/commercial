import { rawApiRequest } from './httpClient';
import { getAccessToken } from './tokenStorage';
import { ORDERS_SERVICE_BASE_URL } from './config';

export interface IOrderLine {
  productId: number;
  quantity: number;
  unitPrice: string;
}

export interface ICreateOrder {
  userId: string;
  totalAmount: number;
  orderLines: IOrderLine[];
  fcmToken?: string;
}

export interface IOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  orderLines?: any[];
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

async function authorizedSalesRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = {
    ...(options.headers ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const url = `${ORDERS_SERVICE_BASE_URL}${path}`;
  console.log(`[Sales API Request] ${options.method || 'GET'} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'Sales API request failed');
  }

  return data as T;
}

export async function createOrder(order: ICreateOrder): Promise<any> {
  return await authorizedSalesRequest<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function getUserOrders(userId: string): Promise<IOrder[]> {
  console.log('[orderApi] Fetching orders for userId:', userId);
  const response = await authorizedSalesRequest<any>(`/orders/user/${userId}`, {
    method: 'GET',
  });
  console.log('[orderApi] Raw response:', response);
  console.log('[orderApi] Response type:', typeof response);
  console.log('[orderApi] Is response an array?', Array.isArray(response));
  console.log('[orderApi] Response.orders:', response?.orders);
  console.log('[orderApi] Response.data:', response?.data);
  // Handle both direct array response and wrapped response { orders: IOrder[] }
  const result = Array.isArray(response) ? response : (response?.orders || response?.data || []);
  console.log('[orderApi] Final result length:', result.length);
  console.log('[orderApi] Final result:', result);
  return result;
}

export async function getOrderById(orderId: string): Promise<IOrder> {
  return await authorizedSalesRequest<IOrder>(`/orders/${orderId}`, {
    method: 'GET',
  });
}
