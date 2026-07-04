import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('cart')
export class CartController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    return this.orderService.findAllCarts();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.orderService.getCart(id);
  }

  @Get('/by-user-id/:userId')
  async getCartByUserId(@Param('userId') userId: number) {
    return this.orderService.getCartByUserId(userId);
  }

  @Post()
  async addToCart(@Body() body: {
    userId: number;
    productId: number;
    quantity: number;
    image?: string;
    cartLines?: any[];
  }) {
    return this.orderService.addToCart(body);
  }

  @Delete('/lines/:id')
  async removeCartLine(@Param('id') id: number) {
    return this.orderService.removeCartLine(id);
  }

  @Get('/lines/user/:userId')
  async getCartLinesByUserId(@Param('userId') userId: number) {
    return this.orderService.getCartLinesByUserId(userId);
  }

  @Delete('/user/:userId')
  async clearCartByUserId(@Param('userId') userId: number) {
    return this.orderService.clearCartByUserId(userId);
  }
}
