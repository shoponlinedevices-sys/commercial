import { ClientGrpc } from '@nestjs/microservices';
import * as OrdersModel from '../../../packages/contracts/model/orders/orders.model';
export declare class OrdersGatewayService {
    private client;
    private grpcOrdersService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    getUserOrders(userId: string): Promise<OrdersModel.IGetUserOrdersResponse>;
    getOrder(id: string): Promise<OrdersModel.IGetOrderResponse>;
    createOrder(request: OrdersModel.ICreateOrderRequest): Promise<OrdersModel.ICreateOrderResponse>;
    updateOrderStatus(request: OrdersModel.IUpdateOrderStatusRequest): Promise<OrdersModel.IUpdateOrderStatusResponse>;
    getCart(id: number): Promise<OrdersModel.IGetCartResponse>;
    getCartByUserId(userId: number): Promise<OrdersModel.IGetCartByUserIdResponse>;
    addToCart(request: OrdersModel.IAddToCartRequest): Promise<OrdersModel.IAddToCartResponse>;
    getCartLinesByUserId(userId: number): Promise<OrdersModel.IGetCartLinesByUserIdResponse>;
    removeCartLine(cartLineId: number): Promise<OrdersModel.IRemoveCartLineResponse>;
    clearCartByUserId(userId: number): Promise<OrdersModel.IClearCartByUserIdResponse>;
}
