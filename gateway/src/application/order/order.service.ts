import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from '../../domain/order/order.repository';
import { Order } from '../../domain/order/order.entity';

interface NotificationGrpcService {
  sendNotification(data: { token: string; title: string; body: string; data: Record<string, string> }): any;
  createNotification(data: { userId: string; title: string; message: string; type: string; metadata: Record<string, string> }): any;
}

const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003';

@Injectable()
export class OrderService implements OnModuleInit {
  private notificationService!: NotificationGrpcService;

  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('GRPC_NOTIFICATIONS_SERVICE') private readonly notificationClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService = this.notificationClient.getService<NotificationGrpcService>('NotificationService');
  }

  private async callInventory<T>(action: 'reserve' | 'release' | 'sale' | 'return', payload: Record<string, any>): Promise<T> {
    const response = await fetch(`${PRODUCTS_SERVICE_URL}/inventory/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || data?.error || `Inventory ${action} request failed`);
    }

    return data as T;
  }

  private async reserveOrderLines(cartLines: any[], createdBy?: string | number) {
    const results: Array<{ productId: number; quantity: number; referenceId: string }> = [];

    for (const [index, line] of (cartLines || []).entries()) {
      const productId = Number(line.productId);
      const quantity = Number(line.quantity || 0);
      if (!productId || quantity <= 0) {
        continue;
      }

      const referenceId = `ORD-RES-${Date.now()}-${index}`;
      const result = await this.callInventory<{ item?: any; transaction?: any }>('reserve', {
        productId,
        quantity,
        referenceType: 'order',
        referenceId,
        note: `Đặt hàng - ${createdBy ?? 'gateway'}`,
        createdBy: String(createdBy ?? 'gateway'),
      });

      results.push({ productId, quantity, referenceId });
      if (result?.transaction?.referenceId) {
        results[results.length - 1].referenceId = result.transaction.referenceId;
      }
    }

    return results;
  }

  private async releaseOrderLines(cartLines: any[], createdBy?: string | number) {
    for (const [index, line] of (cartLines || []).entries()) {
      const productId = Number(line.productId);
      const quantity = Number(line.quantity || 0);
      if (!productId || quantity <= 0) {
        continue;
      }

      await this.callInventory('release', {
        productId,
        quantity,
        referenceType: 'order',
        referenceId: `ORD-REL-${Date.now()}-${index}`,
        note: `Huỷ / giải phóng kho - ${createdBy ?? 'gateway'}`,
        createdBy: String(createdBy ?? 'gateway'),
      });
    }
  }

  private async settleOrderInventoryForStatus(order: Order, nextStatus: string, createdBy?: string | number) {
    if (!order || !order.orderLines || order.orderLines.length === 0) {
      return;
    }

    const normalized = (nextStatus || '').trim().toLowerCase();
    if (normalized === 'cancelled' || normalized === 'rejected' || normalized === 'canceled') {
      await this.releaseOrderLines(order.orderLines, createdBy);
      return;
    }

    if (normalized === 'completed' || normalized === 'delivered' || normalized === 'fulfilled') {
      for (const line of order.orderLines) {
        const productId = Number(line.productId);
        const quantity = Number(line.quantity || 0);
        if (!productId || quantity <= 0) {
          continue;
        }

        await this.callInventory('sale', {
          productId,
          quantity,
          referenceType: 'order',
          referenceId: `ORD-SALE-${order.id}-${Date.now()}`,
          note: `Bán hàng - đơn ${order.id}`,
          createdBy: String(createdBy ?? 'gateway'),
        });
      }
      return;
    }

    if (normalized === 'returned' || normalized === 'refund') {
      for (const line of order.orderLines) {
        const productId = Number(line.productId);
        const quantity = Number(line.quantity || 0);
        if (!productId || quantity <= 0) {
          continue;
        }

        await this.callInventory('return', {
          productId,
          quantity,
          referenceType: 'order',
          referenceId: `ORD-RET-${order.id}-${Date.now()}`,
          note: `Trả hàng - đơn ${order.id}`,
          createdBy: String(createdBy ?? 'gateway'),
        });
      }
    }
  }

  async createOrder(userId: number, totalAmount: number, cartLines: any[], fcmToken?: string, customerEmail?: string, customerName?: string, createdBy?: string | number): Promise<Order> {
    const author = String(createdBy ?? 'gateway');

    try {
      await this.reserveOrderLines(cartLines, author);
      const order = await this.orderRepository.createOrder(userId, totalAmount, cartLines, fcmToken, customerEmail, customerName, createdBy);

      if (fcmToken) {
        try {
          await firstValueFrom(this.notificationService.sendNotification({
            token: fcmToken,
            title: 'Đặt hàng thành công',
            body: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalAmount}₫`,
            data: { orderId: order.id.toString(), type: 'order_created' },
          }));
        } catch (error) {
          console.error('Failed to send notification:', error);
        }
      }

      try {
        await firstValueFrom(this.notificationService.createNotification({
          userId: userId.toString(),
          title: 'Đặt hàng thành công',
          message: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalAmount}₫`,
          type: 'order',
          metadata: { orderId: order.id.toString(), totalAmount: order.totalAmount.toString() },
        }));
      } catch (error) {
        console.error('Failed to save notification to database:', error);
      }

      return order;
    } catch (error) {
      await this.releaseOrderLines(cartLines, author).catch((releaseError) => {
        console.error('Failed to release reserved inventory after order creation failure:', releaseError);
      });
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<Order[]> {
    console.log(`[OrderService] Finding orders for userId: ${userId}`);
    const orders = await this.orderRepository.findByUserId(userId);
    console.log(`[OrderService] Found ${orders.length} orders for userId: ${userId}`);
    return orders;
  }

  async findAll(filters?: { from?: string; to?: string; statuses?: string[] }): Promise<Order[]> {
    return this.orderRepository.findAll(filters);
  }

  async updateStatus(orderId: string, status: string, createdBy?: string | number): Promise<Order> {
    const currentOrders = await this.orderRepository.findAll();
    const currentOrder = currentOrders.find((order) => order.id.toString() === orderId);
    const previousStatus = currentOrder?.status || 'pending';
    const updated = await this.orderRepository.updateStatus(orderId, status, createdBy);

    try {
      await this.settleOrderInventoryForStatus(updated, status, createdBy);
    } catch (error) {
      console.error(`Failed to sync inventory for order ${orderId} status ${status}:`, error);
    }

    if (previousStatus && previousStatus.toLowerCase() === 'cancelled' && status.toLowerCase() !== 'cancelled') {
      await this.reserveOrderLines(currentOrder?.orderLines || [], createdBy).catch((reserveError) => {
        console.error('Failed to re-reserve inventory after status recovery:', reserveError);
      });
    }

    return updated;
  }
}
