import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';
export declare class OrderService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get orderRepository();
    private get orderLineRepository();
    private get cartRepository();
    private get cartLineRepository();
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
    findAllCarts(): Promise<{
        carts: CartEntity[];
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
