import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcOrdersService } from '../../../packages/contracts/grpc/interface/grpc-orders.service';
import * as OrdersModel from '../../../packages/contracts/model/orders/orders.model';

@Injectable()
export class OrdersGatewayService {
  private grpcOrdersService: IGrpcOrdersService;

  constructor(@Inject('ORDERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.grpcOrdersService = this.client.getService<IGrpcOrdersService>('OrdersService');
  }

  // Orders
  async getUserOrders(userId: string): Promise<OrdersModel.IGetUserOrdersResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.getUserOrders({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to fetch user orders from orders-svc');
    }
  }

  async getOrder(id: string): Promise<OrdersModel.IGetOrderResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.getOrder({ id })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to fetch order from orders-svc');
    }
  }

  async createOrder(request: OrdersModel.ICreateOrderRequest): Promise<OrdersModel.ICreateOrderResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.createOrder(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to create order in orders-svc');
    }
  }

  async updateOrderStatus(request: OrdersModel.IUpdateOrderStatusRequest): Promise<OrdersModel.IUpdateOrderStatusResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.updateOrderStatus(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to update order status in orders-svc');
    }
  }

  // Cart
  async getCart(id: number): Promise<OrdersModel.IGetCartResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.getCart({ id })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to fetch cart from orders-svc');
    }
  }

  async getCartByUserId(userId: number): Promise<OrdersModel.IGetCartByUserIdResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.getCartByUserId({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to fetch cart by user id from orders-svc');
    }
  }

  async addToCart(request: OrdersModel.IAddToCartRequest): Promise<OrdersModel.IAddToCartResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.addToCart(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to add to cart in orders-svc');
    }
  }

  async getCartLinesByUserId(userId: number): Promise<OrdersModel.IGetCartLinesByUserIdResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.getCartLinesByUserId({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to fetch cart lines from orders-svc');
    }
  }

  async removeCartLine(cartLineId: number): Promise<OrdersModel.IRemoveCartLineResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.removeCartLine({ cartLineId })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to remove cart line in orders-svc');
    }
  }

  async clearCartByUserId(userId: number): Promise<OrdersModel.IClearCartByUserIdResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcOrdersService.clearCartByUserId({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling orders-svc:', error);
      throw new Error('Failed to clear cart in orders-svc');
    }
  }
}
