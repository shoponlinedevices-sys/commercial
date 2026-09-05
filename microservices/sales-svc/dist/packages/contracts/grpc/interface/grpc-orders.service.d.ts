import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import * as OrdersModel from "../../model/orders/orders.model";
export interface IGrpcOrdersService {
    getUserOrders(input?: OrdersModel.IGetUserOrdersRequest, metadata?: Metadata): Observable<OrdersModel.IGetUserOrdersResponse>;
    getAllOrders(input?: {}, metadata?: Metadata): Observable<{
        orders: OrdersModel.IOrder[];
    }>;
    getOrder(input?: OrdersModel.IGetOrderRequest, metadata?: Metadata): Observable<OrdersModel.IGetOrderResponse>;
    createOrder(input?: OrdersModel.ICreateOrderRequest, metadata?: Metadata): Observable<OrdersModel.ICreateOrderResponse>;
    updateOrderStatus(input?: OrdersModel.IUpdateOrderStatusRequest, metadata?: Metadata): Observable<OrdersModel.IUpdateOrderStatusResponse>;
    getCart(input?: OrdersModel.IGetCartRequest, metadata?: Metadata): Observable<OrdersModel.IGetCartResponse>;
    getAllCarts(input?: {}, metadata?: Metadata): Observable<{
        carts: OrdersModel.ICart[];
    }>;
    getCartByUserId(input?: OrdersModel.IGetCartByUserIdRequest, metadata?: Metadata): Observable<OrdersModel.IGetCartByUserIdResponse>;
    addToCart(input?: OrdersModel.IAddToCartRequest, metadata?: Metadata): Observable<OrdersModel.IAddToCartResponse>;
    getCartLinesByUserId(input?: OrdersModel.IGetCartLinesByUserIdRequest, metadata?: Metadata): Observable<OrdersModel.IGetCartLinesByUserIdResponse>;
    removeCartLine(input?: OrdersModel.IRemoveCartLineRequest, metadata?: Metadata): Observable<OrdersModel.IRemoveCartLineResponse>;
    clearCartByUserId(input?: OrdersModel.IClearCartByUserIdRequest, metadata?: Metadata): Observable<OrdersModel.IClearCartByUserIdResponse>;
}
