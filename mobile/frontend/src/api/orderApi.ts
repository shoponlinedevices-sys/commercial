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
  return await authorizedSalesRequest<IOrder[]>(`/orders/user/${userId}`, {
    method: 'GET',
  });
}

export async function getOrderById(orderId: string): Promise<IOrder> {
  return await authorizedSalesRequest<IOrder>(`/orders/${orderId}`, {
    method: 'GET',
  });
}
