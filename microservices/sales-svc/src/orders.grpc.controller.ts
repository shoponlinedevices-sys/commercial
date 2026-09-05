import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrdersGrpcController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrdersService', 'GetUserOrders')
  async getUserOrders(data: { userId: string }) {
    return { orders: await this.orderService.getUserOrders(data.userId) };
  }

  @GrpcMethod('OrdersService', 'GetAllOrders')
  async getAllOrders() {
    return { orders: await this.orderService.getAllOrders() };
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
  async updateOrderStatus(data: { id: string; status: string }) {
    return { order: await this.orderService.updateOrderStatus(data.id, data.status) };
  }

  @GrpcMethod('OrdersService', 'GetAllCarts')
  async getAllCarts() {
    return this.orderService.findAllCarts();
  }

  @GrpcMethod('OrdersService', 'GetCart')
  async getCart(data: { id: number }) {
    return this.orderService.getCart(data.id);
  }

  @GrpcMethod('OrdersService', 'GetCartByUserId')
  async getCartByUserId(data: { userId: number }) {
    return this.orderService.getCartByUserId(data.userId);
  }

  @GrpcMethod('OrdersService', 'AddToCart')
  async addToCart(data: any) {
    return this.orderService.addToCart(data);
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