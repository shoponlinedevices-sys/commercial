import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from '../../domain/order/order.repository';
import { Order } from '../../domain/order/order.entity';
import { IGrpcOrdersService } from '../../../../packages/contracts/grpc/interface/grpc-orders.service';

@Injectable()
export class SalesServiceOrderRepository implements OrderRepository, OnModuleInit {
  private ordersService!: IGrpcOrdersService;

  constructor(@Inject('GRPC_ORDERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService = this.client.getService<IGrpcOrdersService>('OrdersService');
  }

  private toOrder(data: any): Order {
    return new Order(parseInt(data.id, 10), parseInt(data.userId, 10), data.totalAmount || 0,
      data.status || 'pending', new Date(data.createdAt), new Date(data.updatedAt),
      data.orderLines?.map((line: any) => ({
        productId: parseInt(line.productId, 10), quantity: line.quantity, unitPrice: line.unitPrice,
      })));
  }

  async createOrder(userId: number, totalAmount: number, cartLines: any[], fcmToken?: string, customerEmail?: string, customerName?: string): Promise<Order> {
    const calculatedTotal = cartLines.reduce(
      (total, line) => total + Number(line.unitPrice || 0) * Number(line.quantity || 0),
      0,
    );
    const orderTotal = Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : calculatedTotal;

    const response = await firstValueFrom(this.ordersService.createOrder({
      userId: userId.toString(), totalAmount: orderTotal, orderLines: cartLines, fcmToken, customerEmail, customerName,
    }));
    return this.toOrder(response.order);
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const response = await firstValueFrom(this.ordersService.getUserOrders({ userId: userId.toString() }));
    return (response.orders || []).map((order) => this.toOrder(order));
  }

  async findAll(filters?: { from?: string; to?: string; statuses?: string[] }): Promise<Order[]> {
    const response = await firstValueFrom(this.ordersService.getAllOrders(filters || {}));
    return (response.orders || []).map((order) => this.toOrder(order));
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const response = await firstValueFrom(this.ordersService.updateOrderStatus({ id: orderId, status }));
    return this.toOrder(response.order);
  }
}
