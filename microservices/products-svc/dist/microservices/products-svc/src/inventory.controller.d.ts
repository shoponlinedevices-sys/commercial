import { ProductService } from './product.service';
export declare class InventoryController {
    private readonly productService;
    private readonly logger;
    constructor(productService: ProductService);
    private normalizeCreatedBy;
    getSummary(): Promise<{
        totalProducts: number;
        totalOnHand: number;
        lowStockItems: number;
        outOfStockItems: number;
        inventoryValue: number;
        hasCostData: boolean;
    }>;
    getInventory(page?: string, limit?: string, search?: string, category?: string, status?: string): Promise<{
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
    getTransactions(page?: string, limit?: string, productId?: string, type?: string): Promise<{
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
    getInventoryDetail(productId: string): Promise<{
        item: any;
    } | {
        productName: string;
        sku: string;
        quantityAvailable: number;
        status: string;
        id: number;
        productId: number;
        quantityOnHand: number;
        quantityReserved: number;
        reorderLevel: number;
        createdAt: Date;
        updatedAt: Date;
        product: import("./product.entity").ProductEntity;
        item?: undefined;
    }>;
    importStock(body: {
        productId: number;
        quantity: number;
        unitCost?: number;
        reference?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: import("./inventory.entity").InventoryEntity;
        transaction: import("./inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    reserveStock(body: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: import("./inventory.entity").InventoryEntity;
        transaction: import("./inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    releaseStock(body: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: import("./inventory.entity").InventoryEntity;
        transaction: import("./inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    saleStock(body: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: import("./inventory.entity").InventoryEntity;
        transaction: import("./inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    returnStock(body: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: import("./inventory.entity").InventoryEntity;
        transaction: import("./inventory-transaction.entity").InventoryTransactionEntity;
    }>;
    adjustStock(body: {
        productId: number;
        quantityAfter: number;
        reason: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: import("./inventory.entity").InventoryEntity;
        transaction: import("./inventory-transaction.entity").InventoryTransactionEntity;
    }>;
}
