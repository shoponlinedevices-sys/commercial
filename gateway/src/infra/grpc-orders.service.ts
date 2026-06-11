import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Cart } from '../domain/cart/cart.entity';
import { CartLine } from '../domain/cart/cart-line.entity';

@Injectable()
export class OrdersGrpcService implements OnModuleInit, OnModuleDestroy {
  private client!: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'orders',
        protoPath: join(__dirname, '../../../packages/contracts/proto/orders.proto'),
        url: 'localhost:50053',
      },
    });
  }

  onModuleDestroy() {
    this.client.close();
  }

  async addToCart(userId: number, productId: number, quantity: number): Promise<Cart> {
    try {
      const response = await this.client.send(
        'AddToCart',
        { userId, productId, quantity, cartLines: [] },
      ).toPromise();

      return this.mapProtoToCart(response);
    } catch (error) {
      console.error('gRPC Error in addToCart:', error);
      throw error;
    }
  }

  async getCartByUserId(userId: number): Promise<Cart | null> {
    try {
      const response = await this.client.send(
        'GetCartByUserId',
        { userId },
      ).toPromise();

      if (!response || !response.cart) {
        return null;
      }

      return this.mapProtoToCart(response.cart);
    } catch (error) {
      console.error('gRPC Error in getCartByUserId:', error);
      throw error;
    }
  }

  async getCartLinesByUserId(userId: number): Promise<CartLine[]> {
    try {
      const response = await this.client.send(
        'GetCartLinesByUserId',
        { userId },
      ).toPromise();

      if (!response || !response.cartLines) {
        return [];
      }

      return response.cartLines.map((line: any) => this.mapProtoToCartLine(line));
    } catch (error) {
      console.error('gRPC Error in getCartLinesByUserId:', error);
      throw error;
    }
  }

  async removeCartLine(cartLineId: number): Promise<boolean> {
    try {
      const response = await this.client.send(
        'RemoveCartLine',
        { cartLineId },
      ).toPromise();

      return response?.success || false;
    } catch (error) {
      console.error('gRPC Error in removeCartLine:', error);
      throw error;
    }
  }

  async clearCartByUserId(userId: number): Promise<boolean> {
    try {
      const response = await this.client.send(
        'ClearCartByUserId',
        { userId },
      ).toPromise();

      return response?.success || false;
    } catch (error) {
      console.error('gRPC Error in clearCartByUserId:', error);
      throw error;
    }
  }

  private mapProtoToCart(proto: any): Cart {
    return new Cart(
      proto.id || 0,
      proto.userId || 0,
      proto.totalPrice || '0',
      proto.status || 1,
      proto.createdAt ? new Date(proto.createdAt) : new Date(),
      proto.updatedAt ? new Date(proto.updatedAt) : new Date(),
      proto.cartLines?.map((line: any) => this.mapProtoToCartLine(line)) || []
    );
  }

  private mapProtoToCartLine(proto: any): CartLine {
    return new CartLine(
      proto.id || 0,
      proto.cartId || 0,
      proto.productId || 0,
      proto.quantity || 1,
      proto.unitPrice?.toString() || '0',
      proto.totalPrice?.toString() || '0',
      proto.status || 1,
      proto.createdAt ? new Date(proto.createdAt) : new Date(),
      proto.updatedAt ? new Date(proto.updatedAt) : new Date()
    );
  }
}
