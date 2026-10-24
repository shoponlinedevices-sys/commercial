import { ProductEntity } from './product.entity';
export declare class InventoryEntity {
    id: number;
    productId: number;
    quantityOnHand: number;
    quantityReserved: number;
    reorderLevel: number;
    createdAt: Date;
    updatedAt: Date;
    product: ProductEntity;
}
