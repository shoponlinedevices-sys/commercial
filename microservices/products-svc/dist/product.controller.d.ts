import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(query: any): Promise<{
        products: import("./product.entity").ProductEntity[];
        total: number;
    }>;
    getProduct(id: string): Promise<{
        product: import("./product.entity").ProductEntity;
    }>;
}
