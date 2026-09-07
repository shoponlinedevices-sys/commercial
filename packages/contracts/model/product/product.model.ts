import { Id } from "../common/common.model";

export interface IProduct extends Id {
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  badge?: string;
  sku?: string;
  unit?: string;
  moq?: string;
}

export interface IGetProductsRequest {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface IGetProductsResponse {
  products: IProduct[];
  total: number;
}

export interface IGetProductRequest {
  id: number;
}

export interface IGetProductResponse {
  product: IProduct;
}

export interface ICreateProductRequest {
  name: string;
  price: number;
  description?: string;
  image?: string;
  oldPrice?: number;
  badge?: string;
  sku?: string;
  unit?: string;
  moq?: string;
  category?: string;
  createdBy?: string;
}

export interface ICreateProductResponse {
  product: IProduct;
}
