import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(userId);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Post()
  async createOrder(@Body() body: {
    userId: string;
    totalAmount: number;
    orderLines: any[];
    shippingAddress?: string;
    fcmToken?: string;
  }) {
    return this.orderService.createOrder(body);
  }

  @Post(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.orderService.updateOrderStatus(id, body.status);
  }
}
