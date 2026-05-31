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

  async createOrder(userId: number, cartLines: any[], fcmToken?: string): Promise<Order> {
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
        savedOrder.totalPrice!,
        savedOrder.status!,
        savedOrder.createdAt!,
        savedOrder.updatedAt!,
      );
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const orders = await this.orderRepo.find({ where: { userId } });
    return orders.map(
      (order) =>
        new Order(
          order.id!,
          order.userId!,
          order.totalPrice!,
          order.status!,
          order.createdAt!,
          order.updatedAt!,
        ),
    );
  }
}
