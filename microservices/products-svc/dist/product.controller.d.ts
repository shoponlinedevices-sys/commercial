import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getHistoryLogs(limit?: string): Promise<import("./history-log.entity").HistoryLogEntity[]>;
    getProducts(query: any): Promise<{
        products: import("./product.entity").ProductEntity[];
        total: number;
    }>;
    getProduct(id: string): Promise<{
        product: import("./product.entity").ProductEntity;
    }>;
    createProduct(body: {
        name: string;
        price: number;
        description?: string;
        image?: string;
        oldPrice?: number;
        badge?: string;
        sku?: string;
        unit?: string;
        moq?: string;
        category?: string;
    }): Promise<{
        product: import("./product.entity").ProductEntity;
    }>;
}
