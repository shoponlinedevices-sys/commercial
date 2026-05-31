import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
export declare class OrderService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get orderRepository();
    private get orderLineRepository();
    getUserOrders(userId: string): Promise<OrderEntity[]>;
    getOrderById(orderId: string): Promise<OrderEntity>;
    createOrder(data: {
        userId: string;
        totalAmount: number;
        orderLines: any[];
        shippingAddress?: string;
        fcmToken?: string;
    }): Promise<OrderEntity>;
    updateOrderStatus(orderId: string, status: string): Promise<OrderEntity>;
}
