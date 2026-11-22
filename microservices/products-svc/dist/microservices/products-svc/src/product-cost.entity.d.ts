import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';
export declare class ProductCostEntity {
    id: string;
    productId: number;
    supplierId: number | null;
    importPrice: string;
    quantity: number;
    shippingFee: string;
    otherFee: string;
    importDate: Date;
    note: string | null;
    createdAt: Date;
    product: ProductEntity;
    supplier: SupplierEntity | null;
}
