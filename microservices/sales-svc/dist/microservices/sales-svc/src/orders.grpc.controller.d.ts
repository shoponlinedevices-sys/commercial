import { OrderService } from './order.service';
export declare class OrdersGrpcController {
    private readonly orderService;
    constructor(orderService: OrderService);
    private serializeCart;
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
        carts: {
            createdAt: string;
            updatedAt: string;
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            cartLines?: import("./cart-line.entity").CartLineEntity[];
        }[];
    }>;
    getCart(data: {
        id: number;
    }): Promise<{
        cart: {
            createdAt: string;
            updatedAt: string;
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            cartLines?: import("./cart-line.entity").CartLineEntity[];
        };
    }>;
    getCartByUserId(data: {
        userId: number;
    }): Promise<{
        cart: {
            createdAt: string;
            updatedAt: string;
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            cartLines?: import("./cart-line.entity").CartLineEntity[];
        };
    }>;
    addToCart(data: any): Promise<{
        cart: {
            createdAt: string;
            updatedAt: string;
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            cartLines?: import("./cart-line.entity").CartLineEntity[];
        };
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
