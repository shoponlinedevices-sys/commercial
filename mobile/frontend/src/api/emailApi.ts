import { rawApiRequest } from './httpClient';
import { getAccessToken } from './tokenStorage';
import { EMAIL_SERVICE_BASE_URL } from './config';

async function authorizedEmailRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = {
    ...(options.headers ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const url = `${EMAIL_SERVICE_BASE_URL}${path}`;
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
  orderId: string,
  totalAmount: number
): Promise<any> {
  const subject = 'Xác nhận đơn hàng thành công';
  const body = `
    <h2>Đơn hàng của bạn đã được đặt thành công!</h2>
    <p>Mã đơn hàng: #${orderId}</p>
    <p>Tổng tiền: ${totalAmount.toLocaleString('vi-VN')} ₫</p>
    <p>Cảm ơn bạn đã mua hàng tại Shop Online Devices.</p>
  `;

  return await authorizedEmailRequest<any>('/emails', {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      subject,
      body,
    }),
  });
}
