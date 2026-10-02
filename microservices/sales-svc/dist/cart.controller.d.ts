import { OrderService } from './order.service';
export declare class CartController {
    private readonly orderService;
    constructor(orderService: OrderService);
    findAll(): Promise<{
        carts: import("./cart.entity").CartEntity[];
    }>;
    findOne(id: number): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    getCartByUserId(userId: number): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    addToCart(body: {
        userId: number;
        productId: number;
        quantity: number;
        image?: string;
        cartLines?: any[];
    }): Promise<{
        cart: import("./cart.entity").CartEntity;
    }>;
    removeCartLine(id: number): Promise<{
        success: boolean;
    }>;
    getCartLinesByUserId(userId: number): Promise<{
        cartLines: import("./cart-line.entity").CartLineEntity[];
    }>;
    clearCartByUserId(userId: number): Promise<{
        success: boolean;
    }>;
}
