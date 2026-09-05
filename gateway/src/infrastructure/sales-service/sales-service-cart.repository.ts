import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CartRepository } from '../../domain/cart/cart.repository';
import { Cart } from '../../domain/cart/cart.entity';
import { IGrpcOrdersService } from '../../../../packages/contracts/grpc/interface/grpc-orders.service';

@Injectable()
export class SalesServiceCartRepository implements CartRepository, OnModuleInit {
  private ordersService!: IGrpcOrdersService;

  constructor(@Inject('GRPC_ORDERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService = this.client.getService<IGrpcOrdersService>('OrdersService');
  }

  private toCart(data: any): Cart {
    return new Cart(data.id, data.userId, data.totalPrice || '0', data.status || 0,
      new Date(data.createdAt), new Date(data.updatedAt), data.cartLines);
  }

  async findAll(): Promise<Cart[]> {
    const response = await firstValueFrom(this.ordersService.getAllCarts({}));
    return (response.carts || []).map((cart) => this.toCart(cart));
  }

  async findOne(id: number): Promise<Cart | null> {
    const response = await firstValueFrom(this.ordersService.getCart({ id }));
    return response.cart ? this.toCart(response.cart) : null;
  }

  async getCartByUserId(userId: number): Promise<Cart | null> {
    const response = await firstValueFrom(this.ordersService.getCartByUserId({ userId }));
    return response.cart ? this.toCart(response.cart) : null;
  }

  async create(item: Cart): Promise<Cart> {
    const line = item.cartLines?.[0];
    const response = await firstValueFrom(this.ordersService.addToCart({
      userId: item.userId,
      productId: line?.productId || 0,
      quantity: line?.quantity || 0,
      cartLines: item.cartLines?.map((line: any) => ({
        ...line,
        unitPrice: Number(line.unitPrice),
      })),
      image: line?.image,
    }));
    return this.toCart(response.cart);
  }

  async deleteCartLineById(id: number): Promise<void> {
    await firstValueFrom(this.ordersService.removeCartLine({ cartLineId: id }));
  }

  async getCartLinesByUserId(userId: number): Promise<any[]> {
    const response = await firstValueFrom(this.ordersService.getCartLinesByUserId({ userId }));
    return response.cartLines || [];
  }

  async clearCartByUserId(userId: number): Promise<void> {
    await firstValueFrom(this.ordersService.clearCartByUserId({ userId }));
  }

  async addToCart(userId: number, productId: number, quantity: number, image?: string): Promise<Cart> {
    const response = await firstValueFrom(this.ordersService.addToCart({ userId, productId, quantity, image }));
    return this.toCart(response.cart);
  }
}
