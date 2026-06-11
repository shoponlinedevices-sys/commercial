import { UserInfo } from "./account";
import { IProduct } from "./product";

export type ICart = {
  id?: number;
  userId?: number;
  totalPrice?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  cartLines?: ICartLine[];
}

export type ICartLine = {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product?: IProduct;
  name?: string;
  image?: string;
  status?: number;
}

export type IAddToCart = {
  userId: number;
  productId: number;
  quantity: number;
  cartLines?: ICartLine[];
}