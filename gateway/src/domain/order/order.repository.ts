import { Order } from './order.entity';

export abstract class OrderRepository {
  abstract createOrder(userId: number, cartLines: any[], fcmToken?: string): Promise<Order>;
  abstract findByUserId(userId: number): Promise<Order[]>;
}
