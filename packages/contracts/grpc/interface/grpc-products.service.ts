import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { IProduct, ICreateProductRequest, ICreateProductResponse, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse, IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse, ISaleInventory, IProductSaleStock, IFindProducts } from "../../model/product/product.model";
import {
  IProductCost,
  IProductCostFilters,
  IProductCostSummary,
  ISupplier,
  ISupplierFilters,
  ISupplierMutation,
} from "../../model/product/supplier-cost.model";

export interface SupplierMutationRequest extends ISupplierMutation {
  id: number;
  hasName: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasAddress: boolean;
  hasTaxCode: boolean;
  hasNote: boolean;
}

export interface ProductCostMutationRequest {
  id: string;
  productId: number;
  supplierId: number;
  importPrice: string;
  quantity: number;
  shippingFee: string;
  otherFee: string;
  importDate: string;
  note: string;
  hasProductId: boolean;
  hasSupplierId: boolean;
  hasImportPrice: boolean;
  hasQuantity: boolean;
  hasShippingFee: boolean;
  hasOtherFee: boolean;
  hasImportDate: boolean;
  hasNote: boolean;
}

export interface IGrpcProductService {
  getHistoryLogs(input?: { limit: number }): Observable<{ logs: any[] }>;
  getProducts(input?: IGetProductsRequest, metadata?: Metadata): Observable<IGetProductsResponse>;
  getFeaturedProducts(input: Record<string, never>): Observable<IGetProductsResponse>;
  getProductsGroupedByCategory(input?: IGetProductsGroupedByCategoryRequest): Observable<IGetProductsGroupedByCategoryResponse>;
  getProduct(input?: IGetProductRequest, metadata?: Metadata): Observable<IGetProductResponse>;
  createProduct(input: ICreateProductRequest, metadata?: Metadata): Observable<ICreateProductResponse>;
  findOne(input: { id: number }, metadata?: Metadata): Observable<IProduct>;
  findAll(input?: IFindProducts): Observable<IGetProductsResponse>;
  createSupplier(input: SupplierMutationRequest): Observable<ISupplier>;
  listSuppliers(input: ISupplierFilters & { hasStatus: boolean }): Observable<{ items: ISupplier[]; total: number; page: number; limit: number }>;
  getSupplier(input: { id: number }): Observable<ISupplier>;
  updateSupplier(input: SupplierMutationRequest): Observable<ISupplier>;
  updateSupplierStatus(input: { id: number; status: number }): Observable<ISupplier>;
  createProductCost(input: ProductCostMutationRequest): Observable<IProductCost>;
  listProductCosts(input: IProductCostFilters & { hasProductId: boolean; hasSupplierId: boolean }): Observable<{ items: IProductCost[]; total: number; page: number; limit: number }>;
  getProductCost(input: { id: string }): Observable<IProductCost>;
  updateProductCost(input: ProductCostMutationRequest): Observable<IProductCost>;
  listProductCostHistory(input: { productId: number; page: number; limit: number }): Observable<{ items: IProductCost[]; total: number; page: number; limit: number }>;
  getLatestProductCost(input: { productId: number }): Observable<{ found: boolean; item?: IProductCost }>;
  getProductCostSummary(input: Record<string, never>): Observable<IProductCostSummary>;
}
