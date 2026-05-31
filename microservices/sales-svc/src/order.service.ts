import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderLineEntity } from './order-line.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  private get orderRepository() {
    return this.dataSource.getRepository(OrderEntity);
  }

  private get orderLineRepository() {
    return this.dataSource.getRepository(OrderLineEntity);
  }

  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: string) {
    return this.orderRepository.findOne({
      where: { id: orderId },
    });
  }

  async createOrder(data: {
    userId: string;
    totalAmount: number;
    orderLines: any[];
    shippingAddress?: string;
    fcmToken?: string;
  }) {
    return this.dataSource.transaction(async (manager) => {
      // Create order
      const order = manager.create(OrderEntity, {
        userId: data.userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        fcmToken: data.fcmToken,
        status: 'pending',
      });
      
      const savedOrder = await manager.save(OrderEntity, order);

      // Create order lines
      const orderLineEntities = data.orderLines.map((line) => {
        const unitPrice = parseFloat(line.unitPrice);
        const totalPrice = unitPrice * line.quantity;
        
        return manager.create(OrderLineEntity, {
          orderId: savedOrder.id,
          productId: line.productId.toString(),
          unitPrice: line.unitPrice,
          quantity: line.quantity,
          totalPrice: totalPrice.toString(),
        });
      });

      if (orderLineEntities.length > 0) {
        await manager.save(OrderLineEntity, orderLineEntities);
      }

      // Return order with lines
      return this.orderRepository.findOne({
        where: { id: savedOrder.id },
      });
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return this.orderRepository.save(order);
  }
}
