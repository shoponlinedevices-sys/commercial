import { DataSource } from 'typeorm';
import { ProductEntity } from './product.entity';
import { HistoryLogEntity } from './history-log.entity';
import { InventoryEntity } from './inventory.entity';
import { InventoryTransactionEntity } from './inventory-transaction.entity';
import { SupplierEntity } from './supplier.entity';
import { Id } from '../../../packages/contracts/model/common/common.model';
import { IProduct, IGetProductsResponse, IFindProducts, IGetProductsGroupedByCategoryResponse, IGetProductsGroupedByCategoryRequest } from '../../../packages/contracts/model/product/product.model';
export interface SupplierInput {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    taxCode?: string | null;
    note?: string | null;
}
export interface ProductCostInput {
    productId?: number;
    supplierId?: number | null;
    importPrice?: number;
    quantity?: number;
    shippingFee?: number;
    otherFee?: number;
    importDate?: Date;
    note?: string | null;
}
export interface ProductCostView {
    id: string;
    productId: number;
    productName: string;
    sku: string | null;
    salePrice: number;
    supplierId: number | null;
    supplierName: string | null;
    importPrice: number;
    quantity: number;
    shippingFee: number;
    otherFee: number;
    totalGoods: number;
    totalFees: number;
    totalValue: number;
    unitCost: number;
    expectedProfit: number;
    profitMarginPercent: number | null;
    importDate: Date;
    note: string | null;
    createdAt: Date;
}
export declare class ProductService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get productRepository();
    private get inventoryRepository();
    private get inventoryTransactionRepository();
    private get supplierRepository();
    private get productCostRepository();
    createSupplier(input: SupplierInput): Promise<SupplierEntity>;
    listSuppliers(filters: {
        search?: string;
        status?: number;
        page: number;
        limit: number;
    }): Promise<{
        items: SupplierEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSupplier(id: number): Promise<SupplierEntity>;
    updateSupplier(id: number, input: SupplierInput): Promise<SupplierEntity>;
    updateSupplierStatus(id: number, status: number): Promise<SupplierEntity>;
    createProductCost(input: ProductCostInput): Promise<ProductCostView>;
    updateProductCost(id: string, input: ProductCostInput): Promise<ProductCostView>;
    listProductCosts(filters: {
        productId?: number;
        supplierId?: number;
        search?: string;
        from?: Date;
        to?: Date;
        page: number;
        limit: number;
    }): Promise<{
        items: ProductCostView[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductCost(id: string): Promise<ProductCostView>;
    getLatestProductCost(productId: number): Promise<ProductCostView>;
    getProductCostSummary(): Promise<{
        totalImports: number;
        totalValue: number;
        productsWithCost: number;
    }>;
    private ensureCostProduct;
    private ensureCostSupplier;
    private productCostResponse;
    private moneyToCents;
    private addAvailableQuantity;
    getHistoryLogs(limit?: number): Promise<HistoryLogEntity[]>;
    getProducts(filters?: {
        category?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        products: (ProductEntity & {
            quantityAvailable: number;
        })[];
        total: number;
    }>;
    getFeaturedProducts(): Promise<IGetProductsResponse>;
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
    getProductsGroupedByCategory(filters?: IGetProductsGroupedByCategoryRequest): Promise<IGetProductsGroupedByCategoryResponse>;
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
    findOne(id: Id): Promise<IProduct>;
    findAll(input: IFindProducts): Promise<IGetProductsResponse>;
}
