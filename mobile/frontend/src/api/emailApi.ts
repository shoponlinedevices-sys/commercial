import { rawApiRequest } from './httpClient';
import { getAccessToken } from './tokenStorage';
import { API_BASE_URL, EMAIL_SERVICE_BASE_URL } from './config';

async function authorizedEmailRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = {
    ...(options.headers ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const url = `${API_BASE_URL}${path}`;
  console.log(`[Email API Request] ${options.method || 'GET'} ${url}`);

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
    throw new Error(data?.message || response.statusText || 'Email API request failed');
  }

  return data as T;
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    orderId: string;
    totalAmount: number;
    orderLines: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      productImage?: string;
    }>;
    shippingAddress?: string;
    customerName?: string;
  }
): Promise<any> {
  return await authorizedEmailRequest<any>('/emails/order-confirmation', {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      ...orderData,
    }),
  });
}
