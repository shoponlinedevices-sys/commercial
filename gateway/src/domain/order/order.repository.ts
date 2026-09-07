import { Order } from './order.entity';

export abstract class OrderRepository {
  abstract createOrder(userId: number, totalAmount: number, cartLines: any[], fcmToken?: string, customerEmail?: string, customerName?: string, createdBy?: string | number): Promise<Order>;
  abstract findByUserId(userId: number): Promise<Order[]>;
  abstract findAll(filters?: { from?: string; to?: string; statuses?: string[] }): Promise<Order[]>;
  abstract updateStatus(orderId: string, status: string, createdBy?: string | number): Promise<Order>;
}
