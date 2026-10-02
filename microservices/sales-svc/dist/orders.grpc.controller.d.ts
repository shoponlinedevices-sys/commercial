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
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            createdAt: string;
            updatedAt: string;
            cartLines: {
                id: number;
                cartId: number;
                productId: number;
                quantity: number;
                unitPrice: number;
                status: number;
                name: string;
                image: string;
            }[];
        }[];
    }>;
    getCart(data: {
        id: number;
    }): Promise<{
        cart: {
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            createdAt: string;
            updatedAt: string;
            cartLines: {
                id: number;
                cartId: number;
                productId: number;
                quantity: number;
                unitPrice: number;
                status: number;
                name: string;
                image: string;
            }[];
        };
    }>;
    getCartByUserId(data: {
        userId: number;
    }): Promise<{
        cart: {
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            createdAt: string;
            updatedAt: string;
            cartLines: {
                id: number;
                cartId: number;
                productId: number;
                quantity: number;
                unitPrice: number;
                status: number;
                name: string;
                image: string;
            }[];
        };
    }>;
    addToCart(data: any): Promise<{
        cart: {
            id: number;
            userId: number;
            totalPrice: string;
            status: number;
            createdAt: string;
            updatedAt: string;
            cartLines: {
                id: number;
                cartId: number;
                productId: number;
                quantity: number;
                unitPrice: number;
                status: number;
                name: string;
                image: string;
            }[];
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
