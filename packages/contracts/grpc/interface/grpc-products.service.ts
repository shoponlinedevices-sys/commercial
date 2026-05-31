import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse } from "../../model/product/product.model";

export interface IGrpcProductService {
  getProducts(input?: IGetProductsRequest, metadata?: Metadata): Observable<IGetProductsResponse>;
  getProduct(input?: IGetProductRequest, metadata?: Metadata): Observable<IGetProductResponse>;
}
