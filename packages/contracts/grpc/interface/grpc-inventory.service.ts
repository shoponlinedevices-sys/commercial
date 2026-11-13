import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { ICreateProductRequest, ICreateProductResponse, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse, IGetProductsRequest, IGetProductsResponse, IGetProductRequest, IGetProductResponse, ISaleInventory, IProductSaleStock } from "../../model/product/product.model";
import { IInventorySummary, IInventorySummaryRequest } from "../../model/inventory/inventory.model";

export interface IGrpcInventoryService {
  saleStock(input: IProductSaleStock): Observable<ISaleInventory>;
  returnInventory(input: IProductSaleStock): Observable<ISaleInventory>;
  summary(input: IInventorySummaryRequest): Observable<IInventorySummary>;
}
