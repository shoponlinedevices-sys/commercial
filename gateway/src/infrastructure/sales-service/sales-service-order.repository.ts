import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/order/order.repository';
import { Order } from '../../domain/order/order.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SalesServiceOrderRepository implements OrderRepository {
  constructor(private readonly httpService: HttpService) {}

  async createOrder(userId: number, cartLines: any[], fcmToken?: string): Promise<Order> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${process.env.SALES_SERVICE_URL || 'http://localhost:3001'}/orders`,
        {
          userId: userId.toString(),
          totalAmount: 0, // Will be calculated by sales-svc
          orderLines: cartLines,
          fcmToken,
        },
      );
      
      const orderData = response.data;
      return new Order(
        parseInt(orderData.id),
        parseInt(orderData.userId),
        orderData.totalAmount || 0,
        orderData.status || 'pending',
        new Date(orderData.createdAt),
        new Date(orderData.updatedAt),
      );
    } catch (error) {
      console.error('[SalesServiceOrderRepository] Error creating order:', error);
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<Order[]> {
    try {
      console.log(`[SalesServiceOrderRepository] Fetching orders for userId: ${userId}`);
      const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
      const url = `${salesServiceUrl}/orders/user/${userId}`;
      console.log(`[SalesServiceOrderRepository] Calling URL: ${url}`);
      
      const response = await this.httpService.axiosRef.get(url);
      
      const ordersData = response.data;
      console.log(`[SalesServiceOrderRepository] Found ${ordersData.length} orders`);
      console.log(`[SalesServiceOrderRepository] Orders data:`, JSON.stringify(ordersData, null, 2));
      
      return ordersData.map((orderData: any) => 
        new Order(
          parseInt(orderData.id),
          parseInt(orderData.userId),
          orderData.totalAmount || 0,
          orderData.status || 'pending',
          new Date(orderData.createdAt),
          new Date(orderData.updatedAt),
          orderData.orderLines?.map((line: any) => ({
            productId: parseInt(line.productId),
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        )
      );
    } catch (error) {
      console.error('[SalesServiceOrderRepository] Error fetching orders:', error);
      console.error('[SalesServiceOrderRepository] Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
}
