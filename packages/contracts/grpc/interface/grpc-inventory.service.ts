import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { ICreateProductRequest, ICreateProductResponse, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse, IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse, ISaleInventory, IProductSaleStock } from "../../model/product/product.model";

export interface IGrpcInventoryService {
  saleStock(input: IProductSaleStock): Observable<ISaleInventory>;
}
