import { Order } from './order.entity';

export abstract class OrderRepository {
  abstract createOrder(userId: number, cartLines: any[], fcmToken?: string, customerEmail?: string, customerName?: string): Promise<Order>;
  abstract findByUserId(userId: number): Promise<Order[]>;
  abstract findAll(filters?: { from?: string; to?: string; statuses?: string[] }): Promise<Order[]>;
  abstract updateStatus(orderId: string, status: string): Promise<Order>;
}
