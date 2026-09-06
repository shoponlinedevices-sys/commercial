import { ProductService } from './product.service';
export declare class ProductGrpcController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(query: any): Promise<{
        products: import("./product.entity").ProductEntity[];
        total: number;
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
