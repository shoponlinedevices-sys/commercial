import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { ICreateProductRequest, ICreateProductResponse, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse, IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse } from "../../model/product/product.model";
export interface IGrpcProductService {
    getProducts(input?: IGetProductsRequest, metadata?: Metadata): Observable<IGetProductsResponse>;
    getProductsGroupedByCategory(input?: IGetProductsGroupedByCategoryRequest, metadata?: Metadata): Observable<IGetProductsGroupedByCategoryResponse>;
    getProduct(input?: IGetProductRequest, metadata?: Metadata): Observable<IGetProductResponse>;
    createProduct(input: ICreateProductRequest, metadata?: Metadata): Observable<ICreateProductResponse>;
}
