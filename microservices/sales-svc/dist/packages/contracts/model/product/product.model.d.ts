import { Id } from "../common/common.model";
import { TransactionType } from "./enum";
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
    quantityAvailable?: number;
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
export interface IProductsGroupedByCategoryResponse {
    id: number;
    name: string;
    slug: string;
    isActive: number;
    icon: string;
    products: IProduct[];
}
export interface IGetProductsGroupedByCategoryRequest {
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
}
export interface IGetProductsGroupedByCategoryResponse {
    categories: IProductsGroupedByCategoryResponse[];
}
export interface IProductSaleStock {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
}
export interface IProductSaleStockResult {
    id: number;
    productId: number;
    quantityOnHand: number;
    quantityReserved: number;
    reorderLevel: number;
    createdAt: Date;
    updatedAt: Date;
    product: IProduct;
}
export interface IInventoryTransaction {
    id: number;
    productId: number;
    transactionType: TransactionType;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    quantityBefore: number;
    quantityAfter: number;
    note?: string;
    createdBy?: number;
    createdAt: Date;
    product: IProduct;
}
export interface ISaleInventory {
    item: IProductSaleStockResult;
    transaction: IInventoryTransaction;
}
