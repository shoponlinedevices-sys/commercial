import { ProductEntity } from './product.entity';
export declare class InventoryTransactionEntity {
    id: number;
    productId: number;
    transactionType: 'import' | 'reserve' | 'release' | 'sale' | 'return' | 'adjustment';
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    quantityBefore: number;
    quantityAfter: number;
    note?: string;
    createdBy?: number;
    createdAt: Date;
    product: ProductEntity;
}
