import { OriginProductService } from 'src/services/product.service';
import { IProductSaleStock } from '../../../../packages/contracts/model/product/product.model';
import { IInventorySummary } from '../../../../packages/contracts/model/inventory/inventory.model';
export declare class InventoryGrpcController {
    private readonly productService;
    private readonly logger;
    constructor(productService: OriginProductService);
    private normalizeCreatedBy;
    private toProtoTimestamp;
    private serializeInventoryResult;
    saleStock(body: IProductSaleStock): Promise<import("../../../../packages/contracts/model/product/product.model").ISaleInventory & {
        item: {
            createdAt: string;
            updatedAt: string;
        };
        transaction: {
            createdAt: string;
        };
    }>;
    returnInventory(body: IProductSaleStock): Promise<import("../../../../packages/contracts/model/product/product.model").ISaleInventory & {
        item: {
            createdAt: string;
            updatedAt: string;
        };
        transaction: {
            createdAt: string;
        };
    }>;
    summary(): Promise<IInventorySummary>;
    getItems(data: any): Promise<{
        items: {
            updatedAt: string;
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
            createdAt: string;
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
            note: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    importStock(data: any): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    } & {
        item: {
            createdAt: string;
            updatedAt: string;
        };
        transaction: {
            createdAt: string;
        };
    }>;
    reserveStock(data: IProductSaleStock): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    } & {
        item: {
            createdAt: string;
            updatedAt: string;
        };
        transaction: {
            createdAt: string;
        };
    }>;
    releaseStock(data: IProductSaleStock): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    } & {
        item: {
            createdAt: string;
            updatedAt: string;
        };
        transaction: {
            createdAt: string;
        };
    }>;
    adjustStock(data: any): Promise<{
        item: import("../inventory.entity").InventoryEntity;
        transaction: import("../inventory-transaction.entity").InventoryTransactionEntity;
    } & {
        item: {
            createdAt: string;
            updatedAt: string;
        };
        transaction: {
            createdAt: string;
        };
    }>;
}
