import { OriginProductService } from 'src/services/product.service';
import { IProductSaleStock, ISaleInventory } from '../../../../packages/contracts/model/product/product.model';
import { IInventorySummary } from '../../../../packages/contracts/model/inventory/inventory.model';
export declare class InventoryGrpcController {
    private readonly productService;
    private readonly logger;
    constructor(productService: OriginProductService);
    private normalizeCreatedBy;
    saleStock(body: IProductSaleStock): Promise<ISaleInventory>;
    returnInventory(body: IProductSaleStock): Promise<ISaleInventory>;
    summary(): Promise<IInventorySummary>;
    getItems(data: any): Promise<{
        items: {
            id: number;
            productId: number;
            productName: string;
            sku: string;
            category: any;
            quantityOnHand: number;
            quantityReserved: number;
            quantityAvailable: number;
            reorderLevel: number;
            unitPrice: number;
            updatedAt: Date;
            status: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getItem(data: {
        productId: number;
    }): Promise<{
        item: any;
    }>;
    getTransactions(data: any): Promise<{
        items: {
            id: number;
            productId: number;
            productName: string;
            transactionType: "import" | "reserve" | "release" | "sale" | "return" | "adjustment";
            quantity: number;
            referenceType: string;
            referenceId: string;
            quantityBefore: number;
            quantityAfter: number;
            createdBy: number;
            createdAt: Date;
            note: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    importStock(data: any): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    reserveStock(data: IProductSaleStock): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    releaseStock(data: IProductSaleStock): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    adjustStock(data: any): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    }>;
}
