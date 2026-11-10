import { BadRequestException, Controller, Post, Body, UseGuards, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { OrderService } from '../../application/order/order.service';
import { ICreateOrderRequest } from '../../../../packages/contracts/model/orders/orders.model';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ schema: { example: { userId: 1, orderLines: [{ productId: 1, unitPrice: 10, quantity: 2 }], fcmToken: 'optional_fcm_token' } } })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOrder(@Body() body: Omit<ICreateOrderRequest, 'orderLines'> & {
    orderLines?: ICreateOrderRequest['orderLines'];
    cartLines?: ICreateOrderRequest['orderLines'];
  }) {
    const { cartLines, orderLines: providedOrderLines, ...orderData } = body;
    const orderLines = providedOrderLines ?? cartLines;
    if (!Array.isArray(orderLines)) {
      throw new BadRequestException('orderLines must be an array');
    }

    const order = await this.orderService.createOrder({ ...orderData, orderLines });
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all orders for CRM' })
  async getAllOrders(
    @Query('from') from?: Date,
    @Query('to') to?: Date,
    @Query('status') status?: string | string[],
  ) {
    const statuses = status ? (Array.isArray(status) ? status : [status]) : undefined;
    return this.orderService.findAll({ from, to, statuses });
  }

  // @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrdersByUserId(@Param('userId') userId: string) {
    console.log(`[OrderController] getOrdersByUserId called with userId: ${userId}`);
    const parsedUserId = parseInt(userId, 10);
    console.log(`[OrderController] Parsed userId: ${parsedUserId}`);
    return this.orderService.findByUserId(parsedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() request: any) {
    return this.orderService.updateStatus(id, body.status, request.user?.id);
  }
}
