import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getUserOrders(userId: string): Promise<import("./order.entity").OrderEntity[]>;
    getOrderById(id: string): Promise<import("./order.entity").OrderEntity>;
    createOrder(body: {
        userId: string;
        totalAmount: number;
        orderLines: any[];
        shippingAddress?: string;
        fcmToken?: string;
    }): Promise<import("./order.entity").OrderEntity>;
    updateOrderStatus(id: string, body: {
        status: string;
    }): Promise<import("./order.entity").OrderEntity>;
}
