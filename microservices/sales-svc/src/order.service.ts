import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderLineEntity } from './order-line.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';

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

  private get cartRepository() {
    return this.dataSource.getRepository(CartEntity);
  }

  private get cartLineRepository() {
    return this.dataSource.getRepository(CartLineEntity);
  }

  // Orders
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
      return manager.findOne(OrderEntity, {
        where: { id: savedOrder.id },
        relations: ['orderLines'],
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
    cartLines?: any[];
  }) {
    try {
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
      } else {
        const validQuantity = data.quantity || 1;
        cartLine = this.cartLineRepository.create({
          cartId: cart.id,
          productId: data.productId,
          quantity: isNaN(validQuantity) ? 1 : validQuantity,
          unitPrice: 0, // Will be updated when product info is fetched
          status: 1,
          name: data.cartLines?.[0]?.name || 'Sản phẩm',
          image: data.cartLines?.[0]?.image || 'https://via.placeholder.com/150',
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
