import { Controller, Get, Query } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CartEntity } from './cart.entity';

@Controller()
export class OrdersGrpcController {
  constructor(private readonly orderService: OrderService) {}

  private serializeCart(cart: CartEntity | null) {
    if (!cart) {
      return null;
    }

    return {
      ...cart,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  }

  @Get('history-logs')
  async getHistoryLogs(@Query('limit') limit?: string) {
    return this.orderService.getHistoryLogs(Number(limit) || 200);
  }

  @GrpcMethod('OrdersService', 'GetUserOrders')
  async getUserOrders(data: { userId: string }) {
    return { orders: await this.orderService.getUserOrders(data.userId) };
  }

  @GrpcMethod('OrdersService', 'GetAllOrders')
  async getAllOrders(data: { from?: string; to?: string; statuses?: string[] }) {
    return { orders: await this.orderService.getAllOrders(data) };
  }

  @GrpcMethod('OrdersService', 'GetOrder')
  async getOrder(data: { id: string }) {
    return { order: await this.orderService.getOrderById(data.id) };
  }

  @GrpcMethod('OrdersService', 'CreateOrder')
  async createOrder(data: any) {
    return { order: await this.orderService.createOrder(data) };
  }

  @GrpcMethod('OrdersService', 'UpdateOrderStatus')
  async updateOrderStatus(data: { id: string; status: string; createdBy?: string }) {
    return { order: await this.orderService.updateOrderStatus(data.id, data.status, data.createdBy) };
  }

  @GrpcMethod('OrdersService', 'GetAllCarts')
  async getAllCarts() {
    const { carts } = await this.orderService.findAllCarts();
    return { carts: carts.map((cart) => this.serializeCart(cart)) };
  }

  @GrpcMethod('OrdersService', 'GetCart')
  async getCart(data: { id: number }) {
    const { cart } = await this.orderService.getCart(data.id);
    return { cart: this.serializeCart(cart) };
  }

  @GrpcMethod('OrdersService', 'GetCartByUserId')
  async getCartByUserId(data: { userId: number }) {
    const { cart } = await this.orderService.getCartByUserId(data.userId);
    return { cart: this.serializeCart(cart) };
  }

  @GrpcMethod('OrdersService', 'AddToCart')
  async addToCart(data: any) {
    const { cart } = await this.orderService.addToCart(data);
    return { cart: this.serializeCart(cart) };
  }

  @GrpcMethod('OrdersService', 'GetCartLinesByUserId')
  async getCartLinesByUserId(data: { userId: number }) {
    return this.orderService.getCartLinesByUserId(data.userId);
  }

  @GrpcMethod('OrdersService', 'RemoveCartLine')
  async removeCartLine(data: { cartLineId: number }) {
    return this.orderService.removeCartLine(data.cartLineId);
  }

  @GrpcMethod('OrdersService', 'ClearCartByUserId')
  async clearCartByUserId(data: { userId: number }) {
    return this.orderService.clearCartByUserId(data.userId);
  }
}