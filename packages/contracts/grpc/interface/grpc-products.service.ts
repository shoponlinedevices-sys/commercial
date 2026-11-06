import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { IProduct, ICreateProductRequest, ICreateProductResponse, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse, IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse, ISaleInventory, IProductSaleStock, IFindProducts } from "../../model/product/product.model";

export interface IGrpcProductService {
  getProducts(input?: IGetProductsRequest, metadata?: Metadata): Observable<IGetProductsResponse>;
  getProductsGroupedByCategory(input?: IGetProductsGroupedByCategoryRequest): Observable<IGetProductsGroupedByCategoryResponse>;
  getProduct(input?: IGetProductRequest, metadata?: Metadata): Observable<IGetProductResponse>;
  createProduct(input: ICreateProductRequest, metadata?: Metadata): Observable<ICreateProductResponse>;
  findOne(input: { id: number }, metadata?: Metadata): Observable<IProduct>;
  findAll(input?: IFindProducts): Observable<IGetProductsResponse>;
}
