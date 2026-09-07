import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { And, DataSource, FindOptionsWhere, In, LessThan, MoreThanOrEqual } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderLineEntity } from './order-line.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';
import { ProductEntity } from './product.entity';
import { OrdersEmailProvider } from './orders-email.provider';
import { HistoryLogEntity } from './history-log.entity';

const ORDER_EMAIL_RECIPIENTS = [
  'shoponlinedevices@gmail.com',
];

@Injectable()
export class OrderService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
    private readonly ordersEmailProvider: OrdersEmailProvider,
  ) {}

  private get productRepository() {
    return this.dataSource.getRepository(ProductEntity);
  }

  private get orderRepository() {
    return this.dataSource.getRepository(OrderEntity);
  }

  private get orderLineRepository() {
    return this.dataSource.getRepository(OrderLineEntity);
  }

  private get cartRepository() {
    return this.dataSource.getRepository(CartEntity);
  }

  private get cartLineRepository() {
    return this.dataSource.getRepository(CartLineEntity);
  }

  async getHistoryLogs(limit = 200) {
    return this.dataSource.getRepository(HistoryLogEntity).find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 500),
    });
  }

  // Orders
  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders(filters: { from?: string; to?: string; statuses?: string[] } = {}) {
    const where: FindOptionsWhere<OrderEntity> = {};
    if (filters.from && filters.to) {
      where.createdAt = And(MoreThanOrEqual(new Date(filters.from)), LessThan(new Date(filters.to)));
    } else if (filters.from) {
      where.createdAt = MoreThanOrEqual(new Date(filters.from));
    } else if (filters.to) {
      where.createdAt = LessThan(new Date(filters.to));
    }
    if (filters.statuses?.length) {
      where.status = In(filters.statuses);
    }

    return this.orderRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['orderLines'],
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
    customerEmail?: string;
    customerName?: string;
    createdBy?: string;
  }) {
    const calculatedTotal = data.orderLines.reduce((total, line) => {
      const unitPrice = Number(line.unitPrice);
      const quantity = Number(line.quantity);
      return Number.isFinite(unitPrice) && Number.isFinite(quantity)
        ? total + unitPrice * quantity
        : total;
    }, 0);
    const totalAmount = calculatedTotal > 0 ? calculatedTotal : Number(data.totalAmount) || 0;

    const order = await this.dataSource.transaction(async (manager) => {
      // Create order
      const order = manager.create(OrderEntity, {
        userId: data.userId,
        totalAmount,
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

      await manager.save(HistoryLogEntity, manager.create(HistoryLogEntity, {
        action: 'CREATE',
        entityType: 'ORDER',
        entityId: String(savedOrder.id),
        source: 'sales-svc',
        createdBy: data.createdBy || `user:${data.userId}`,
        metadata: { userId: data.userId, totalAmount, lineCount: orderLineEntities.length },
      }));

      // Return order with lines
      return manager.findOne(OrderEntity, {
        where: { id: savedOrder.id },
        relations: ['orderLines'],
      });
    });

    const recipients = [
      ...ORDER_EMAIL_RECIPIENTS,
      ...(data.customerEmail && !ORDER_EMAIL_RECIPIENTS.includes(data.customerEmail)
        ? [data.customerEmail]
        : []),
    ];

    const orderLines = (order?.orderLines || []).map((line) => ({
      productId: String(line.productId),
      productName: 'Sản phẩm',
      quantity: line.quantity,
      unitPrice: Number(line.unitPrice),
      totalPrice: Number(line.totalPrice),
    }));

    await Promise.all(recipients.map(async (to) => {
      try {
        const response = await this.ordersEmailProvider.sendOrderConfirmationEmail({
          to,
          orderId: String(order.id),
          totalAmount: Number(order.totalAmount),
          orderLines,
          shippingAddress: order.shippingAddress,
          customerName: data.customerName,
        });

        if (!response.success) {
          console.error(`[OrderEmail] Failed to send order ${order.id} email to ${to}: ${response.error || 'unknown error'}`);
        }
      } catch (error) {
        console.error(`[OrderEmail] Error sending order ${order.id} email to ${to}:`, error);
      }
    }));

    return order;
  }

  async updateOrderStatus(orderId: string, status: string, createdBy?: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
    const previousStatus = order.status;
    order.status = status;
    const updated = await this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(OrderEntity, order);
      await manager.save(HistoryLogEntity, manager.create(HistoryLogEntity, {
        action: 'UPDATE',
        entityType: 'ORDER',
        entityId: String(orderId),
        source: 'sales-svc',
        createdBy: createdBy || `user:${order.userId}`,
        metadata: { field: 'status', previousStatus, status },
      }));
      return saved;
    });
    return updated;
  }

  // Cart
  async findAllCarts() {
    const carts = await this.cartRepository.find({
      relations: ['cartLines'],
    });

    return { carts };
  }

  async getCart(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { id },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    return { cart };
  }

  async getCartByUserId(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartLines'],
    });

    if (!cart) {
      return { cart: null };
    }

    return { cart };
  }

  async addToCart(data: {
    userId: number;
    productId: number;
    quantity: number;
    image?: string;
    cartLines?: any[];
  }) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: data.productId },
      });

      console.log('addToCart', product);

      if(!product) {
        throw new Error('Product not found');
      }
      
      let cart = await this.cartRepository.findOne({
        where: { userId: data.userId },
      });

      if (!cart) {
        cart = this.cartRepository.create({
          userId: data.userId,
          totalPrice: '0',
          status: 1,
        });
        cart = await this.cartRepository.save(cart);
      }

      // Add or update cart line
      let cartLine = await this.cartLineRepository.findOne({
        where: { cartId: cart.id, productId: data.productId },
      });

      if (cartLine) {
        const newQuantity = cartLine.quantity + (data.quantity || 0);
        cartLine.quantity = isNaN(newQuantity) ? cartLine.quantity : newQuantity;
        // Update image if provided
        if (data.image) {
          cartLine.image = data.image;
        }
      } else {
        const validQuantity = data.quantity || 1;
        cartLine = this.cartLineRepository.create({
          cartId: cart.id,
          productId: data.productId,
          quantity: isNaN(validQuantity) ? 1 : validQuantity,
          unitPrice: product.price,
          status: 1,
          name: data.cartLines?.[0]?.name || 'Sản phẩm',
          image: data.image || data.cartLines?.[0]?.image || 'https://via.placeholder.com/150',
        });
      }

      await this.cartLineRepository.save(cartLine);

      // Recalculate total price
      const cartLines = await this.cartLineRepository.find({
        where: { cartId: cart.id },
      });
      const totalPrice = cartLines.reduce((sum, line) => sum + (Number(line.unitPrice) * line.quantity), 0);
      cart.totalPrice = totalPrice.toString();
      await this.cartRepository.save(cart);

      const updatedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
      });

      return { cart: updatedCart };
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }

  async getCartLinesByUserId(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
    });

    if (!cart) {
      return { cartLines: [] };
    }

    const cartLines = await this.cartLineRepository.find({
      where: { cartId: cart.id },
    });

    return { cartLines };
  }

  async removeCartLine(cartLineId: number) {
    try {
      const cartLine = await this.cartLineRepository.findOne({
        where: { id: cartLineId },
      });

      if (!cartLine) {
        throw new Error('Cart line not found');
      }

      await this.cartLineRepository.remove(cartLine);

      // Recalculate total price
      const cart = await this.cartRepository.findOne({
        where: { id: cartLine.cartId },
      });

      if (cart) {
        const cartLines = await this.cartLineRepository.find({
          where: { cartId: cart.id },
        });
        const totalPrice = cartLines.reduce((sum, line) => sum + (Number(line.unitPrice) * line.quantity), 0);
        cart.totalPrice = totalPrice.toString();
        await this.cartRepository.save(cart);
      }

      return { success: true };
    } catch (error) {
      console.error('Error in removeCartLine:', error);
      throw error;
    }
  }

  async clearCartByUserId(userId: number) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { userId },
      });

      if (!cart) {
        return { success: true };
      }

      await this.cartLineRepository.delete({ cartId: cart.id });
      cart.totalPrice = '0';
      await this.cartRepository.save(cart);

      return { success: true };
    } catch (error) {
      console.error('Error in clearCartByUserId:', error);
      throw error;
    }
  }
}
