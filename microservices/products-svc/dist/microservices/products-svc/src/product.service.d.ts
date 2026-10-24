import { DataSource } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import { HistoryLogEntity } from './history-log.entity';
import { InventoryEntity } from './inventory.entity';
import { InventoryTransactionEntity } from './inventory-transaction.entity';
export declare class ProductService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get productRepository();
    private get inventoryRepository();
    private get inventoryTransactionRepository();
    getHistoryLogs(limit?: number): Promise<HistoryLogEntity[]>;
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
        categoryId?: number;
        createdBy?: string;
    }): Promise<{
        product: ProductEntity;
    }>;
    getProductsGroupedByCategory(filters?: {
        search?: string;
        categoryId?: number;
        limit?: number;
        offset?: number;
    }): Promise<CategoryEntity[]>;
    getInventorySummary(): Promise<{
        totalProducts: number;
        totalOnHand: number;
        lowStockItems: number;
        outOfStockItems: number;
        inventoryValue: number;
        hasCostData: boolean;
    }>;
    getInventoryList(filters?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        status?: string;
    }): Promise<{
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
    getInventoryDetail(productId: number): Promise<{
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
        product: ProductEntity;
        item?: undefined;
    }>;
    getInventoryTransactions(filters?: {
        page?: number;
        limit?: number;
        productId?: number;
        type?: string;
    }): Promise<{
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
    private ensureProductExists;
    private ensureInventoryRecord;
    importInventory(data: {
        productId: number;
        quantity: number;
        unitCost?: number;
        reference?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: InventoryEntity;
        transaction: InventoryTransactionEntity;
    }>;
    reserveInventory(data: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: InventoryEntity;
        transaction: InventoryTransactionEntity;
    }>;
    releaseInventory(data: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: InventoryEntity;
        transaction: InventoryTransactionEntity;
    }>;
    saleInventory(data: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: InventoryEntity;
        transaction: InventoryTransactionEntity;
    }>;
    returnInventory(data: {
        productId: number;
        quantity: number;
        referenceType?: string;
        referenceId?: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: InventoryEntity;
        transaction: InventoryTransactionEntity;
    }>;
    adjustInventory(data: {
        productId: number;
        quantityAfter: number;
        reason: string;
        note?: string;
        createdBy?: number;
    }): Promise<{
        item: InventoryEntity;
        transaction: InventoryTransactionEntity;
    }>;
}
