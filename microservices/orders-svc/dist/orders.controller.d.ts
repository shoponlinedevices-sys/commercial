import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getUserOrders(userId: string): Promise<import("./order.entity").OrderEntity[]>;
    getOrder(id: string): Promise<{
        order: import("./order.entity").OrderEntity;
    }>;
    createOrder(body: any): Promise<{
        order: import("./order.entity").OrderEntity;
    }>;
    updateOrderStatus(id: string, body: {
        status: string;
    }): Promise<{
        order: import("./order.entity").OrderEntity;
    }>;
    getCart(id: string): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    getCartByUserId(userId: string): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    addToCart(body: any): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    getCartLinesByUserId(userId: string): Promise<{
        cartLines: import("./cart-line.entity").CartLineEntity[];
    }>;
    removeCartLine(cartLineId: string): Promise<{
        success: boolean;
    }>;
    clearCartByUserId(userId: string): Promise<{
        success: boolean;
    }>;
}
