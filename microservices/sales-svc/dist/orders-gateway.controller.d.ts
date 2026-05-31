import { OrdersGatewayService } from './orders-gateway.service';
export declare class OrdersGatewayController {
    private readonly ordersGatewayService;
    constructor(ordersGatewayService: OrdersGatewayService);
    getUserOrders(userId: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IGetUserOrdersResponse>;
    getOrder(id: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IGetOrderResponse>;
    createOrder(body: any): Promise<import("../../../packages/contracts/model/orders/orders.model").ICreateOrderResponse>;
    updateOrderStatus(id: string, body: {
        status: string;
    }): Promise<import("../../../packages/contracts/model/orders/orders.model").IUpdateOrderStatusResponse>;
    getCart(id: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IGetCartResponse>;
    getCartByUserId(userId: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IGetCartByUserIdResponse>;
    addToCart(body: any): Promise<import("../../../packages/contracts/model/orders/orders.model").IAddToCartResponse>;
    getCartLinesByUserId(userId: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IGetCartLinesByUserIdResponse>;
    removeCartLine(cartLineId: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IRemoveCartLineResponse>;
    clearCartByUserId(userId: string): Promise<import("../../../packages/contracts/model/orders/orders.model").IClearCartByUserIdResponse>;
}
