import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderRepository } from '../../domain/order/order.repository';
import { Order } from '../../domain/order/order.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  async createOrder(userId: number, cartLines: any[], fcmToken?: string): Promise<Order> {
    const order = await this.orderRepository.createOrder(userId, cartLines, fcmToken);

    // Send notification if FCM token is provided
    if (fcmToken) {
      try {
        await this.notificationClient
          .send(
            { role: 'notification', cmd: 'sendNotification' },
            {
              token: fcmToken,
              title: 'Đặt hàng thành công',
              body: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalPrice}₫`,
              data: {
                orderId: order.id.toString(),
                type: 'order_created',
              },
            },
          )
          .toPromise();
      } catch (error) {
        console.error('Failed to send notification:', error);
        // Don't fail the order creation if notification fails
      }
    }

    // Save notification to database
    try {
      await this.httpService.axiosRef.post(
        `${process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3001'}/notifications`,
        {
          userId: userId.toString(),
          title: 'Đặt hàng thành công',
          message: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalPrice}₫`,
          type: 'order',
          metadata: {
            orderId: order.id.toString(),
            totalPrice: order.totalPrice,
          },
        },
      );
    } catch (error) {
      console.error('Failed to save notification to database:', error);
      // Don't fail the order creation if notification save fails
    }

    return order;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
}
