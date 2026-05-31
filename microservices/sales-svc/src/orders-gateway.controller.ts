import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrdersGatewayService } from './orders-gateway.service';

@Controller()
export class OrdersGatewayController {
  constructor(private readonly ordersGatewayService: OrdersGatewayService) {}

  // Orders
  @Get('orders/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.ordersGatewayService.getUserOrders(userId);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.ordersGatewayService.getOrder(id);
  }

  @Post('orders')
  async createOrder(@Body() body: any) {
    return this.ordersGatewayService.createOrder(body);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.ordersGatewayService.updateOrderStatus({ id, status: body.status });
  }

  // Cart
  @Get('cart/:id')
  async getCart(@Param('id') id: string) {
    return this.ordersGatewayService.getCart(parseInt(id));
  }

  @Get('cart/by-user-id/:userId')
  async getCartByUserId(@Param('userId') userId: string) {
    return this.ordersGatewayService.getCartByUserId(parseInt(userId));
  }

  @Post('cart')
  async addToCart(@Body() body: any) {
    return this.ordersGatewayService.addToCart(body);
  }

  @Get('cart/lines/user/:userId')
  async getCartLinesByUserId(@Param('userId') userId: string) {
    return this.ordersGatewayService.getCartLinesByUserId(parseInt(userId));
  }

  @Delete('cart/lines/:cartLineId')
  async removeCartLine(@Param('cartLineId') cartLineId: string) {
    return this.ordersGatewayService.removeCartLine(parseInt(cartLineId));
  }

  @Delete('cart/user/:userId')
  async clearCartByUserId(@Param('userId') userId: string) {
    return this.ordersGatewayService.clearCartByUserId(parseInt(userId));
  }
}
