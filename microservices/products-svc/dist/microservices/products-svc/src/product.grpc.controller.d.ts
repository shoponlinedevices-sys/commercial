import { ProductService } from './product.service';
import { IProductsGroupedByCategoryResponse } from '../../../packages/contracts/model/product/product.model';
export declare class ProductGrpcController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(query: any): Promise<{
        products: import("./product.entity").ProductEntity[];
        total: number;
    }>;
    getProductsGroupedByCategory(filters?: {
        search?: string;
        categoryId?: number;
        limit?: number;
        offset?: number;
    }): Promise<{
        categories: IProductsGroupedByCategoryResponse[];
    }>;
    getProduct(request: {
        id: number;
    }): Promise<{
        product: import("./product.entity").ProductEntity;
    }>;
    createProduct(request: any): Promise<{
        product: import("./product.entity").ProductEntity;
    }>;
}
