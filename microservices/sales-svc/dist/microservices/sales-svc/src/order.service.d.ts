import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';
import { OrdersEmailProvider } from './orders-email.provider';
export declare class OrderService {
    private readonly dataSource;
    private readonly ordersEmailProvider;
    constructor(dataSource: DataSource, ordersEmailProvider: OrdersEmailProvider);
    private get productRepository();
    private get orderRepository();
    private get orderLineRepository();
    private get cartRepository();
    private get cartLineRepository();
    getUserOrders(userId: string): Promise<OrderEntity[]>;
    getAllOrders(filters?: {
        from?: string;
        to?: string;
        statuses?: string[];
    }): Promise<OrderEntity[]>;
    getOrderById(orderId: string): Promise<OrderEntity>;
    createOrder(data: {
        userId: string;
        totalAmount: number;
        orderLines: any[];
        shippingAddress?: string;
        fcmToken?: string;
        customerEmail?: string;
        customerName?: string;
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
        image?: string;
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
