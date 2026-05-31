import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';
export declare class OrdersService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get orderRepository();
    private get orderLineRepository();
    private get cartRepository();
    private get cartLineRepository();
    getUserOrders(userId: string): Promise<OrderEntity[]>;
    getOrder(id: string): Promise<{
        order: OrderEntity;
    }>;
    createOrder(data: {
        userId: string;
        totalAmount: number;
        orderLines: any[];
        shippingAddress?: string;
        fcmToken?: string;
    }): Promise<{
        order: OrderEntity;
    }>;
    updateOrderStatus(id: string, status: string): Promise<{
        order: OrderEntity;
    }>;
    getCart(id: number): Promise<{
        cart: CartEntity;
    }>;
    getCartByUserId(userId: number): Promise<{
        cart: CartEntity;
    }>;
    addToCart(data: {
        userId: number;
        productId: number;
        quantity: number;
        cartLines?: any[];
    }): Promise<{
        cart: CartEntity;
    }>;
    getCartLinesByUserId(userId: number): Promise<{
        cartLines: CartLineEntity[];
    }>;
    removeCartLine(cartLineId: number): Promise<{
        success: boolean;
    }>;
    clearCartByUserId(userId: number): Promise<{
        success: boolean;
    }>;
}
