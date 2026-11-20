import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Cart } from '../../domain/cart/cart.entity';
import { ICart, ICartLine } from '../../../../packages/contracts/model/orders/orders.model';
import { IGrpcOrdersService } from '../../../../packages/contracts/grpc/interface/grpc-orders.service';

@Injectable()
export class CartService implements OnModuleInit {
  private ordersService!: IGrpcOrdersService;

  constructor(@Inject('GRPC_ORDERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService = this.client.getService<IGrpcOrdersService>('OrdersService');
  }

  async findAll(): Promise<ICart[]> {
    const response = await firstValueFrom(this.ordersService.getAllCarts({}));
    return response.carts || [];
  }

  async findOne(id: number): Promise<ICart | null> {
    const response = await firstValueFrom(this.ordersService.getCart({ id }));
    return response.cart || null;
  }

  async getCartByUserId(userId: number): Promise<ICart | null> {
    const response = await firstValueFrom(this.ordersService.getCartByUserId({ userId }));
    return response.cart || null;
  }

  async create(item: Cart): Promise<ICart> {
    const line = item.cartLines?.[0];
    const response = await firstValueFrom(this.ordersService.addToCart({
      userId: item.userId,
      productId: line?.productId || 0,
      quantity: line?.quantity || 0,
      cartLines: item.cartLines?.map((cartLine) => ({
        ...cartLine,
        unitPrice: Number(cartLine.unitPrice),
      })),
      image: line?.image,
    }));
    return response.cart;
  }

  async addToCart(userId: number, productId: number, quantity: number, image?: string): Promise<ICart> {
    const response = await firstValueFrom(this.ordersService.addToCart({ userId, productId, quantity, image }));
    return response.cart;
  }

  async updateCartLineQuantity(cartLineId: number, quantity: number): Promise<void> {
    await firstValueFrom(this.ordersService.updateCartLineQuantity({ cartLineId, quantity }));
  }

  async deleteCartLineById(id: number): Promise<void> {
    await firstValueFrom(this.ordersService.removeCartLine({ cartLineId: id }));
  }

  async getCartLinesByUserId(userId: number): Promise<ICartLine[]> {
    const response = await firstValueFrom(this.ordersService.getCartLinesByUserId({ userId }));
    return response.cartLines || [];
  }

  async clearCartByUserId(userId: number): Promise<void> {
    await firstValueFrom(this.ordersService.clearCartByUserId({ userId }));
  }
}
