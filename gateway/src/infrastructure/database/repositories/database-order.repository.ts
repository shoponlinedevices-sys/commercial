import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderRepository } from '../../../domain/order/order.repository';
import { Order } from '../../../domain/order/order.entity';
import { OrderEntity, CartLineEntity, ProductEntity } from '../entities';

@Injectable()
export class DatabaseOrderRepository implements OrderRepository {
  private orderRepo: Repository<OrderEntity>;
  private cartLineRepo: Repository<CartLineEntity>;
  private productRepo: Repository<ProductEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.orderRepo = this.dataSource.getRepository(OrderEntity);
    this.cartLineRepo = this.dataSource.getRepository(CartLineEntity);
    this.productRepo = this.dataSource.getRepository(ProductEntity);
  }

  async createOrder(userId: number, _totalAmount: number, cartLines: any[], fcmToken?: string, _customerEmail?: string, _customerName?: string): Promise<Order> {
    return this.dataSource.transaction(async (entityManager: any) => {
      // Calculate total price
      let totalPrice = 0;
      for (const line of cartLines) {
        const product = await this.productRepo.findOne({ where: { id: line.productId } });
        if (product) {
          totalPrice += parseFloat(String(product.price || '0')) * line.quantity;
        }
      }

      // Create order
      const orderEntity = entityManager.create(OrderEntity, {
        userId,
        totalPrice: totalPrice.toString(),
        status: 1, // pending
        fcmToken,
      });

      const savedOrder = await entityManager.save(OrderEntity, orderEntity);

      if (!savedOrder.id) {
        throw new Error('Failed to create order');
      }

      // Create order lines
      const lineEntities = cartLines.map((line) =>
        entityManager.create(CartLineEntity, {
          ...line,
        }),
      );

      if (lineEntities.length) {
        await entityManager.save(CartLineEntity, lineEntities);
      }

      // Return order
      return new Order(
        savedOrder.id!,
        savedOrder.userId!,
        parseFloat(savedOrder.totalPrice!),
        this.mapStatusToString(savedOrder.status!),
        savedOrder.createdAt!,
        savedOrder.updatedAt!,
      );
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    console.log(`[DatabaseOrderRepository] Querying orders for userId: ${userId}`);
    const orders = await this.orderRepo.find({ where: { userId } });
    console.log(`[DatabaseOrderRepository] Query result: ${orders.length} orders found`);
    console.log(`[DatabaseOrderRepository] Orders:`, JSON.stringify(orders, null, 2));
    return orders.map(
      (order) =>
        new Order(
          order.id!,
          order.userId!,
          parseFloat(order.totalPrice!),
          this.mapStatusToString(order.status!),
          order.createdAt!,
          order.updatedAt!,
        ),
    );
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepo.find({ order: { createdAt: 'DESC' } });
    return orders.map((order) => new Order(
      order.id!,
      order.userId!,
      parseFloat(order.totalPrice || '0'),
      this.mapStatusToString(order.status || 1),
      order.createdAt!,
      order.updatedAt!,
    ));
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: Number(orderId) } });
    if (!order) throw new Error('Order not found');
    order.status = this.mapStringToStatus(status);
    const savedOrder = await this.orderRepo.save(order);
    return new Order(
      savedOrder.id!,
      savedOrder.userId!,
      parseFloat(savedOrder.totalPrice || '0'),
      this.mapStatusToString(savedOrder.status || 1),
      savedOrder.createdAt!,
      savedOrder.updatedAt!,
    );
  }

  private mapStatusToString(status: number): string {
    switch (status) {
      case 1:
        return 'pending';
      case 2:
        return 'confirmed';
      case 3:
        return 'shipped';
      case 4:
        return 'delivered';
      case 5:
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  private mapStringToStatus(status: string): number {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      case 'cancelled':
        return 5;
      default:
        return 1;
    }
  }
}
