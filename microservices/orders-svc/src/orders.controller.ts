import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Orders
  @Get('orders/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Post('orders')
  async createOrder(@Body() body: any) {
    return this.ordersService.createOrder(body);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  // Cart
  @Get('cart/:id')
  async getCart(@Param('id') id: string) {
    return this.ordersService.getCart(parseInt(id));
  }

  @Get('cart/by-user-id/:userId')
  async getCartByUserId(@Param('userId') userId: string) {
    return this.ordersService.getCartByUserId(parseInt(userId));
  }

  @Post('cart')
  async addToCart(@Body() body: any) {
    return this.ordersService.addToCart(body);
  }

  @Get('cart/lines/user/:userId')
  async getCartLinesByUserId(@Param('userId') userId: string) {
    return this.ordersService.getCartLinesByUserId(parseInt(userId));
  }

  @Delete('cart/lines/:cartLineId')
  async removeCartLine(@Param('cartLineId') cartLineId: string) {
    return this.ordersService.removeCartLine(parseInt(cartLineId));
  }

  @Delete('cart/user/:userId')
  async clearCartByUserId(@Param('userId') userId: string) {
    return this.ordersService.clearCartByUserId(parseInt(userId));
  }
}
