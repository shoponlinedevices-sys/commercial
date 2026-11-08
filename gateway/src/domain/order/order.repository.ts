import { IGetAllOrdersRequest } from '../../../../packages/contracts/model/orders/orders.model';
import { Order } from './order.entity';

export abstract class OrderRepository {
  abstract createOrder(userId: number, totalAmount: number, cartLines: any[], fcmToken?: string, customerEmail?: string, customerName?: string, createdBy?: string | number): Promise<Order>;
  abstract findByUserId(userId: number): Promise<Order[]>;
  abstract findAll(filters?: IGetAllOrdersRequest): Promise<Order[]>;
  abstract updateStatus(orderId: string, status: string, createdBy?: string | number): Promise<Order>;
}
