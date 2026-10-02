import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(query: any): Promise<import("../../../packages/contracts/model/product/product.model").IGetProductsResponse>;
    getProduct(id: string): Promise<import("../../../packages/contracts/model/product/product.model").IGetProductResponse>;
}
