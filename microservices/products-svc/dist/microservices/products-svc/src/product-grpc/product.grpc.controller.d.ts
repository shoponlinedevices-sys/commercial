import { ProductService } from 'src/product.service';
import { IProduct, IGetProductsResponse, IFindProducts, IGetProductsGroupedByCategoryRequest, IGetProductsGroupedByCategoryResponse } from '../../../../packages/contracts/model/product/product.model';
import { Id } from '../../../../packages/contracts/model/common/common.model';
export declare class ProductGrpcController {
    private readonly productService;
    constructor(productService: ProductService);
    getHistoryLogsGrpc(data: {
        limit?: number;
    }): Promise<{
        logs: {
            id: string;
            action: any;
            entityType: any;
            entityId: any;
            source: any;
            createdBy: any;
            metadata: any;
            createdAt: any;
        }[];
    }>;
    getProducts(query: any): Promise<{
        products: (import("../product.entity").ProductEntity & {
            quantityAvailable: number;
        })[];
        total: number;
    }>;
    getFeaturedProducts(): Promise<IGetProductsResponse>;
    getProductsGroupedByCategory(filters?: IGetProductsGroupedByCategoryRequest): Promise<IGetProductsGroupedByCategoryResponse>;
    getProduct(request: {
        id: number;
    }): Promise<{
        product: import("../product.entity").ProductEntity;
    }>;
    createProduct(request: any): Promise<{
        product: import("../product.entity").ProductEntity;
    }>;
    findOne(id: Id): Promise<IProduct>;
    findAll(input: IFindProducts): Promise<IGetProductsResponse>;
}
