import { DataSource } from 'typeorm';
import { ProductEntity } from './product.entity';
export declare class ProductService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get productRepository();
    getProducts(filters?: {
        category?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        products: ProductEntity[];
        total: number;
    }>;
    getProduct(id: number): Promise<{
        product: ProductEntity;
    }>;
    createProduct(input: {
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
        product: ProductEntity;
    }>;
}
