import { apiClient } from '../lib/api-client';
import { ORDERS_BASE_URL } from '../lib/api-config';
import { Order, CreateOrder } from '../types';

export const orderService = {
  async createOrder(order: CreateOrder): Promise<Order> {
    return await apiClient.post<Order>('/orders', {
      userId: Number(order.userId),
      totalAmount: order.totalAmount,
      cartLines: order.orderLines,
      orderLines: order.orderLines,
      shippingAddress: order.shippingAddress,
      fcmToken: order.fcmToken,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
    }, ORDERS_BASE_URL);
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await apiClient.get<Order[] | { orders?: Order[]; data?: Order[] }>(
      `/orders/user/${userId}`,
      ORDERS_BASE_URL,
    );
    return Array.isArray(response) ? response : (response.orders || response.data || []);
  },

  async getOrderById(orderId: string): Promise<Order> {
    return await apiClient.get<Order>(`/orders/${orderId}`, ORDERS_BASE_URL);
  },
};
