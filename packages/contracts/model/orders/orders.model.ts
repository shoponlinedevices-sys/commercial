import { Id } from "../common/common.model";

// Orders
export interface IOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  orderLines?: IOrderLine[];
  shippingAddress?: string;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderLine {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetUserOrdersRequest {
  userId: string;
}

export interface IGetUserOrdersResponse {
  orders: IOrder[];
}

export interface IGetAllOrdersRequest {
  from?: string;
  to?: string;
  statuses?: string[];
}

export interface IGetOrderRequest {
  id: string;
}

export interface IGetOrderResponse {
  order: IOrder;
}

export interface ICreateOrderRequest {
  userId: string;
  totalAmount: number;
  orderLines: IOrderLine[];
  shippingAddress?: string;
  fcmToken?: string;
  customerEmail?: string;
  customerName?: string;
  createdBy?: string;
}

export interface ICreateOrderResponse {
  order: IOrder;
}

export interface IUpdateOrderStatusRequest {
  id: string;
  status: string;
  createdBy?: string;
}

export interface IUpdateOrderStatusResponse {
  order: IOrder;
}

// Cart
export interface ICart {
  id?: number;
  userId?: number;
  totalPrice?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  cartLines?: ICartLine[];
}

export interface ICartLine {
  id?: number;
  cartId?: number;
  productId: number;
  quantity: number;
  unitPrice: number | string;
  status: number;
  name?: string;
  image?: string;
}

export interface IGetCartRequest {
  id: number;
}

export interface IGetCartResponse {
  cart: ICart;
}

export interface IGetCartByUserIdRequest {
  userId: number;
}

export interface IGetCartByUserIdResponse {
  cart: ICart;
}

export interface IAddToCartRequest {
  userId: number;
  productId: number;
  quantity: number;
  cartLines?: ICartLine[];
  image?: string;
}

export interface IAddToCartResponse {
  cart: ICart;
}

export interface IGetCartLinesByUserIdRequest {
  userId: number;
}

export interface IGetCartLinesByUserIdResponse {
  cartLines: ICartLine[];
}

export interface IRemoveCartLineRequest {
  cartLineId: number;
}

export interface IRemoveCartLineResponse {
  success: boolean;
}

export interface IClearCartByUserIdRequest {
  userId: number;
}

export interface IClearCartByUserIdResponse {
  success: boolean;
}
