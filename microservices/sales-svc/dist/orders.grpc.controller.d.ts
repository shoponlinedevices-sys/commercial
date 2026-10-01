import { OrderService } from './order.service';
export declare class OrdersGrpcController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getHistoryLogs(limit?: string): Promise<import("./history-log.entity").HistoryLogEntity[]>;
    getUserOrders(data: {
        userId: string;
    }): Promise<{
        orders: import("./order.entity").OrderEntity[];
    }>;
    getAllOrders(data: {
        from?: string;
        to?: string;
        statuses?: string[];
    }): Promise<{
        orders: import("./order.entity").OrderEntity[];
    }>;
    getOrder(data: {
        id: string;
    }): Promise<{
        order: import("./order.entity").OrderEntity;
    }>;
    createOrder(data: any): Promise<{
        order: import("./order.entity").OrderEntity;
    }>;
    updateOrderStatus(data: {
        id: string;
        status: string;
        createdBy?: string;
    }): Promise<{
        order: import("./order.entity").OrderEntity;
    }>;
    getAllCarts(): Promise<{
        carts: import("./cart.entity").CartEntity[];
    }>;
    getCart(data: {
        id: number;
    }): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    getCartByUserId(data: {
        userId: number;
    }): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    addToCart(data: any): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    getCartLinesByUserId(data: {
        userId: number;
    }): Promise<{
        cartLines: import("./cart-line.entity").CartLineEntity[];
    }>;
    removeCartLine(data: {
        cartLineId: number;
    }): Promise<{
        success: boolean;
    }>;
    clearCartByUserId(data: {
        userId: number;
    }): Promise<{
        success: boolean;
    }>;
}
