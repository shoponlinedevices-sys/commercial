import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { OrderService } from '../../application/order/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() body: { userId: number; cartLines: any[]; fcmToken?: string }) {
    const order = await this.orderService.createOrder(body.userId, body.cartLines, body.fcmToken);
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    console.log(`[OrderController] getOrdersByUserId called with userId: ${userId}`);
    const parsedUserId = parseInt(userId, 10);
    console.log(`[OrderController] Parsed userId: ${parsedUserId}`);
    return this.orderService.findByUserId(parsedUserId);
  }
}
