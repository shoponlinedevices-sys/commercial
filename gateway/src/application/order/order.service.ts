import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from '../../domain/order/order.repository';
import { Order } from '../../domain/order/order.entity';

interface NotificationGrpcService {
  sendNotification(data: { token: string; title: string; body: string; data: Record<string, string> }): any;
  createNotification(data: { userId: string; title: string; message: string; type: string; metadata: Record<string, string> }): any;
}

@Injectable()
export class OrderService implements OnModuleInit {
  private notificationService!: NotificationGrpcService;

  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('GRPC_NOTIFICATIONS_SERVICE') private readonly notificationClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService = this.notificationClient.getService<NotificationGrpcService>('NotificationService');
  }

  async createOrder(userId: number, totalAmount: number, cartLines: any[], fcmToken?: string, customerEmail?: string, customerName?: string): Promise<Order> {
    const order = await this.orderRepository.createOrder(userId, totalAmount, cartLines, fcmToken, customerEmail, customerName);

    // Send notification if FCM token is provided
    if (fcmToken) {
      try {
        await firstValueFrom(this.notificationService.sendNotification({
          token: fcmToken,
          title: 'Đặt hàng thành công',
          body: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalAmount}₫`,
          data: { orderId: order.id.toString(), type: 'order_created' },
        }));
      } catch (error) {
        console.error('Failed to send notification:', error);
        // Don't fail the order creation if notification fails
      }
    }

    // Save notification to database
    try {
      await firstValueFrom(this.notificationService.createNotification({
        userId: userId.toString(),
        title: 'Đặt hàng thành công',
        message: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalAmount}₫`,
        type: 'order',
        metadata: { orderId: order.id.toString(), totalAmount: order.totalAmount.toString() },
      }));
    } catch (error) {
      console.error('Failed to save notification to database:', error);
      // Don't fail the order creation if notification save fails
    }

    return order;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    console.log(`[OrderService] Finding orders for userId: ${userId}`);
    const orders = await this.orderRepository.findByUserId(userId);
    console.log(`[OrderService] Found ${orders.length} orders for userId: ${userId}`);
    return orders;
  }

  async findAll(filters?: { from?: string; to?: string; statuses?: string[] }): Promise<Order[]> {
    return this.orderRepository.findAll(filters);
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    return this.orderRepository.updateStatus(orderId, status);
  }
}
