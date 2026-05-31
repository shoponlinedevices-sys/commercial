import { apiClient } from '../lib/api-client';
import { ORDERS_BASE_URL } from '../lib/api-config';
import { Order, CreateOrder } from '../types';

export const orderService = {
  async createOrder(order: CreateOrder): Promise<Order> {
    return await apiClient.post<Order>('/orders', order, ORDERS_BASE_URL);
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    return await apiClient.get<Order[]>(`/orders/user/${userId}`, ORDERS_BASE_URL);
  },

  async getOrderById(orderId: string): Promise<Order> {
    return await apiClient.get<Order>(`/orders/${orderId}`, ORDERS_BASE_URL);
  },
};
