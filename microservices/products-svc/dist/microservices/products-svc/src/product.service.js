"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const category_entity_1 = require("./category.entity");
const history_log_entity_1 = require("./history-log.entity");
const inventory_entity_1 = require("./inventory.entity");
const inventory_transaction_entity_1 = require("./inventory-transaction.entity");
let ProductService = class ProductService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get productRepository() {
        return this.dataSource.getRepository(product_entity_1.ProductEntity);
    }
    get inventoryRepository() {
        return this.dataSource.getRepository(inventory_entity_1.InventoryEntity);
    }
    get inventoryTransactionRepository() {
        return this.dataSource.getRepository(inventory_transaction_entity_1.InventoryTransactionEntity);
    }
    async getHistoryLogs(limit = 200) {
        return this.dataSource.getRepository(history_log_entity_1.HistoryLogEntity).find({
            order: { createdAt: 'DESC' },
            take: Math.min(limit, 500),
        });
    }
    async getProducts(filters) {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        if (filters?.search) {
            queryBuilder.andWhere('product.name LIKE :search', {
                search: `%${filters.search}%`,
            });
        }
        if (filters?.category) {
            const categoryRepo = this.dataSource.getRepository(category_entity_1.CategoryEntity);
            const category = await categoryRepo.findOne({
                where: { name: filters.category, is_active: 1 },
            });
            if (category) {
                queryBuilder.andWhere('product.category = :category', {
                    category: category.id.toString(),
                });
            }
            else {
                queryBuilder.andWhere('product.category = :category', {
                    category: filters.category,
                });
            }
        }
        if (filters?.limit) {
            queryBuilder.limit(filters.limit);
        }
        if (filters?.offset) {
            queryBuilder.offset(filters.offset);
        }
        const products = await queryBuilder.getMany();
        const total = await queryBuilder.getCount();
        return {
            products,
            total,
        };
    }
    async getProduct(id) {
        const product = await this.productRepository.findOne({
            where: { id },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return { product };
    }
    async createProduct(input) {
        const product = this.productRepository.create({
            name: input.name,
            price: input.price,
            description: input.description || '',
            image: input.image || '',
            oldPrice: input.oldPrice,
            badge: input.badge,
            sku: input.sku,
            unit: input.unit,
            moq: input.moq,
            categoryId: input.categoryId,
        });
        const savedProduct = await this.productRepository.save(product);
        await this.dataSource.getRepository(history_log_entity_1.HistoryLogEntity).save({
            action: 'CREATE',
            entityType: 'PRODUCT',
            entityId: String(savedProduct.id),
            source: 'products-svc',
            createdBy: input.createdBy || 'system',
            metadata: { name: savedProduct.name, price: savedProduct.price, sku: savedProduct.sku },
        });
        return { product: savedProduct };
    }
    async getProductsGroupedByCategory(filters) {
        const categoryRepository = this.dataSource.getRepository(category_entity_1.CategoryEntity);
        const queryBuilder = categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndMapMany('category.products', product_entity_1.ProductEntity, 'product', 'product.categoryId = category.id');
        if (filters?.search) {
            queryBuilder.andWhere('product.name LIKE :search', {
                search: `%${filters.search}%`,
            });
        }
        if (filters?.categoryId) {
            queryBuilder.andWhere('category.id = :categoryId', {
                categoryId: filters.categoryId,
            });
        }
        queryBuilder
            .orderBy('category.sort_order', 'ASC')
            .addOrderBy('product.id', 'DESC');
        if (filters?.limit !== undefined) {
            queryBuilder.take(filters.limit);
        }
        if (filters?.offset !== undefined) {
            queryBuilder.skip(filters.offset);
        }
        const categories = await queryBuilder.getMany();
        return categories;
    }
    async getInventorySummary() {
        const inventoryRows = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndMapOne('inventory.product', product_entity_1.ProductEntity, 'product', 'product.id = inventory.productId')
            .getMany();
        const totalProducts = inventoryRows.length;
        const totalOnHand = inventoryRows.reduce((sum, item) => sum + Number(item.quantityOnHand || 0), 0);
        const lowStockItems = inventoryRows.filter((item) => {
            const available = Number(item.quantityOnHand || 0) - Number(item.quantityReserved || 0);
            return available > 0 && available <= Number(item.reorderLevel || 0);
        }).length;
        const outOfStockItems = inventoryRows.filter((item) => {
            const available = Number(item.quantityOnHand || 0) - Number(item.quantityReserved || 0);
            return available <= 0;
        }).length;
        return {
            totalProducts,
            totalOnHand,
            lowStockItems,
            outOfStockItems,
            inventoryValue: 0,
            hasCostData: false,
        };
    }
    async getInventoryList(filters) {
        const page = Math.max(1, Number(filters?.page || 1));
        const limit = Math.max(1, Math.min(100, Number(filters?.limit || 10)));
        const skip = (page - 1) * limit;
        const queryBuilder = this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndMapOne('inventory.product', product_entity_1.ProductEntity, 'product', 'product.id = inventory.productId')
            .leftJoinAndMapOne('product.category', category_entity_1.CategoryEntity, 'category', 'category.id = product.categoryId');
        if (filters?.search) {
            const search = `%${filters.search.trim()}%`;
            queryBuilder.andWhere('(product.name LIKE :search OR product.sku LIKE :search)', { search });
        }
        if (filters?.category) {
            queryBuilder.andWhere('category.name = :categoryName', { categoryName: filters.category });
        }
        const rawRows = await queryBuilder
            .orderBy('inventory.updatedAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const rows = rawRows.map((item) => {
            const quantityOnHand = Number(item.quantityOnHand || 0);
            const quantityReserved = Number(item.quantityReserved || 0);
            const quantityAvailable = quantityOnHand - quantityReserved;
            let status = 'Còn hàng';
            if (quantityAvailable <= 0) {
                status = 'Hết hàng';
            }
            else if (quantityAvailable <= Number(item.reorderLevel || 0)) {
                status = 'Sắp hết hàng';
            }
            return {
                id: item.id,
                productId: item.productId,
                productName: item.product?.name || 'Sản phẩm',
                sku: item.product?.sku || '',
                category: item.product?.categoryId ? item.product.category?.name || 'Chưa phân loại' : 'Chưa phân loại',
                quantityOnHand,
                quantityReserved,
                quantityAvailable,
                reorderLevel: Number(item.reorderLevel || 0),
                unitPrice: Number(item.product?.price || 0),
                updatedAt: item.updatedAt,
                status,
            };
        });
        const filteredRows = filters?.status
            ? rows.filter((row) => row.status === filters.status)
            : rows;
        return {
            items: filteredRows,
            total: filteredRows.length,
            page,
            limit,
        };
    }
    async getInventoryDetail(productId) {
        const item = await this.inventoryRepository.findOne({
            where: { productId },
            relations: ['product'],
        });
        if (!item) {
            return { item: null };
        }
        const quantityOnHand = Number(item.quantityOnHand || 0);
        const quantityReserved = Number(item.quantityReserved || 0);
        const quantityAvailable = quantityOnHand - quantityReserved;
        const status = quantityAvailable <= 0 ? 'Hết hàng' : (quantityAvailable <= Number(item.reorderLevel || 0) ? 'Sắp hết hàng' : 'Còn hàng');
        return {
            ...item,
            productName: item.product?.name,
            sku: item.product?.sku,
            quantityAvailable,
            status,
        };
    }
    async getInventoryTransactions(filters) {
        const page = Math.max(1, Number(filters?.page || 1));
        const limit = Math.max(1, Math.min(100, Number(filters?.limit || 20)));
        const skip = (page - 1) * limit;
        const queryBuilder = this.inventoryTransactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndMapOne('transaction.product', product_entity_1.ProductEntity, 'product', 'product.id = transaction.productId')
            .orderBy('transaction.createdAt', 'DESC');
        if (filters?.productId) {
            queryBuilder.andWhere('transaction.productId = :productId', { productId: filters.productId });
        }
        if (filters?.type && filters.type !== 'all') {
            queryBuilder.andWhere('transaction.transactionType = :type', { type: filters.type });
        }
        const [rows, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();
        return {
            items: rows.map((row) => ({
                id: row.id,
                productId: row.productId,
                productName: row.product?.name || 'Sản phẩm',
                transactionType: row.transactionType,
                quantity: Number(row.quantity || 0),
                referenceType: row.referenceType,
                referenceId: row.referenceId,
                quantityBefore: Number(row.quantityBefore || 0),
                quantityAfter: Number(row.quantityAfter || 0),
                createdBy: row.createdBy,
                createdAt: row.createdAt,
                note: row.note,
            })),
            total,
            page,
            limit,
        };
    }
    async ensureProductExists(productId) {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }
        return product;
    }
    async ensureInventoryRecord(productId) {
        let inventory = await this.inventoryRepository.findOne({ where: { productId } });
        if (!inventory) {
            inventory = this.inventoryRepository.create({
                productId,
                quantityOnHand: 0,
                quantityReserved: 0,
                reorderLevel: 0,
            });
            inventory = await this.inventoryRepository.save(inventory);
        }
        return inventory;
    }
    async importInventory(data) {
        const productId = Number(data.productId);
        const quantity = Number(data.quantity || 0);
        if (!Number.isFinite(productId) || productId <= 0) {
            throw new Error('Mã sản phẩm không hợp lệ');
        }
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error('Số lượng nhập phải lớn hơn 0');
        }
        await this.ensureProductExists(productId);
        const inventory = await this.ensureInventoryRecord(productId);
        const before = Number(inventory.quantityOnHand || 0);
        inventory.quantityOnHand = before + quantity;
        inventory.updatedAt = new Date();
        const savedInventory = await this.inventoryRepository.save(inventory);
        const transaction = this.inventoryTransactionRepository.create({
            productId,
            transactionType: 'import',
            quantity,
            referenceType: 'purchase',
            referenceId: data.reference || `INV-IMP-${Date.now()}`,
            quantityBefore: before,
            quantityAfter: savedInventory.quantityOnHand,
            note: data.note || 'Nhập kho',
            createdBy: data.createdBy || 'admin',
            createdAt: new Date(),
        });
        await this.inventoryTransactionRepository.save(transaction);
        return { item: savedInventory, transaction };
    }
    async reserveInventory(data) {
        const productId = Number(data.productId);
        const quantity = Number(data.quantity || 0);
        if (!Number.isFinite(productId) || productId <= 0) {
            throw new Error('Mã sản phẩm không hợp lệ');
        }
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error('Số lượng giữ chỗ phải lớn hơn 0');
        }
        await this.ensureProductExists(productId);
        const inventory = await this.ensureInventoryRecord(productId);
        const currentOnHand = Number(inventory.quantityOnHand || 0);
        const currentReserved = Number(inventory.quantityReserved || 0);
        const available = currentOnHand - currentReserved;
        if (quantity > available) {
            throw new Error(`Không đủ tồn kho khả dụng để giữ chỗ. Tồn kho khả dụng hiện tại: ${available}`);
        }
        const nextReserved = currentReserved + quantity;
        inventory.quantityReserved = nextReserved;
        inventory.updatedAt = new Date();
        const savedInventory = await this.inventoryRepository.save(inventory);
        const transaction = this.inventoryTransactionRepository.create({
            productId,
            transactionType: 'reserve',
            quantity,
            referenceType: data.referenceType || 'reserve',
            referenceId: data.referenceId || `RES-${Date.now()}`,
            quantityBefore: currentReserved,
            quantityAfter: nextReserved,
            note: data.note || 'Giữ chỗ kho',
            createdBy: data.createdBy || 'admin',
            createdAt: new Date(),
        });
        await this.inventoryTransactionRepository.save(transaction);
        return { item: savedInventory, transaction };
    }
    async releaseInventory(data) {
        const productId = Number(data.productId);
        const quantity = Number(data.quantity || 0);
        if (!Number.isFinite(productId) || productId <= 0) {
            throw new Error('Mã sản phẩm không hợp lệ');
        }
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error('Số lượng giải phóng phải lớn hơn 0');
        }
        await this.ensureProductExists(productId);
        const inventory = await this.ensureInventoryRecord(productId);
        const currentReserved = Number(inventory.quantityReserved || 0);
        if (quantity > currentReserved) {
            throw new Error(`Số lượng giải phóng không thể vượt số lượng đang giữ chỗ (${currentReserved})`);
        }
        const nextReserved = currentReserved - quantity;
        inventory.quantityReserved = nextReserved;
        inventory.updatedAt = new Date();
        const savedInventory = await this.inventoryRepository.save(inventory);
        const transaction = this.inventoryTransactionRepository.create({
            productId,
            transactionType: 'release',
            quantity: -quantity,
            referenceType: data.referenceType || 'release',
            referenceId: data.referenceId || `REL-${Date.now()}`,
            quantityBefore: currentReserved,
            quantityAfter: nextReserved,
            note: data.note || 'Giải phóng giữ chỗ',
            createdBy: data.createdBy || 'admin',
            createdAt: new Date(),
        });
        await this.inventoryTransactionRepository.save(transaction);
        return { item: savedInventory, transaction };
    }
    async saleInventory(data) {
        const productId = Number(data.productId);
        const quantity = Number(data.quantity || 0);
        if (!Number.isFinite(productId) || productId <= 0) {
            throw new Error('Mã sản phẩm không hợp lệ');
        }
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error('Số lượng bán phải lớn hơn 0');
        }
        await this.ensureProductExists(productId);
        const inventory = await this.ensureInventoryRecord(productId);
        const currentOnHand = Number(inventory.quantityOnHand || 0);
        const currentReserved = Number(inventory.quantityReserved || 0);
        const available = currentOnHand - currentReserved;
        if (quantity > available) {
            throw new Error(`Không đủ tồn kho khả dụng để bán. Tồn kho khả dụng hiện tại: ${available}`);
        }
        const reservedReduction = Math.min(quantity, currentReserved);
        const nextReserved = currentReserved - reservedReduction;
        const nextOnHand = currentOnHand - quantity;
        inventory.quantityOnHand = nextOnHand;
        inventory.quantityReserved = nextReserved;
        inventory.updatedAt = new Date();
        const savedInventory = await this.inventoryRepository.save(inventory);
        const transaction = this.inventoryTransactionRepository.create({
            productId,
            transactionType: 'sale',
            quantity,
            referenceType: data.referenceType || 'sale',
            referenceId: data.referenceId || `SALE-${Date.now()}`,
            quantityBefore: currentOnHand,
            quantityAfter: nextOnHand,
            note: data.note || 'Bán hàng',
            createdBy: data.createdBy || 'admin',
            createdAt: new Date(),
        });
        await this.inventoryTransactionRepository.save(transaction);
        return { item: savedInventory, transaction };
    }
    async returnInventory(data) {
        const productId = Number(data.productId);
        const quantity = Number(data.quantity || 0);
        if (!Number.isFinite(productId) || productId <= 0) {
            throw new Error('Mã sản phẩm không hợp lệ');
        }
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error('Số lượng trả hàng phải lớn hơn 0');
        }
        await this.ensureProductExists(productId);
        const inventory = await this.ensureInventoryRecord(productId);
        const currentOnHand = Number(inventory.quantityOnHand || 0);
        const nextOnHand = currentOnHand + quantity;
        inventory.quantityOnHand = nextOnHand;
        inventory.updatedAt = new Date();
        const savedInventory = await this.inventoryRepository.save(inventory);
        const transaction = this.inventoryTransactionRepository.create({
            productId,
            transactionType: 'return',
            quantity,
            referenceType: data.referenceType || 'return',
            referenceId: data.referenceId || `RET-${Date.now()}`,
            quantityBefore: currentOnHand,
            quantityAfter: nextOnHand,
            note: data.note || 'Trả hàng',
            createdBy: data.createdBy || 'admin',
            createdAt: new Date(),
        });
        await this.inventoryTransactionRepository.save(transaction);
        return { item: savedInventory, transaction };
    }
    async adjustInventory(data) {
        const inventory = await this.inventoryRepository.findOne({ where: { productId: data.productId }, relations: ['product'] });
        if (!inventory) {
            throw new Error('Không tìm thấy tồn kho cho sản phẩm');
        }
        const current = Number(inventory.quantityOnHand || 0);
        const next = Number(data.quantityAfter || current);
        if (!Number.isFinite(next)) {
            throw new Error('Tồn kho sau kiểm kê không hợp lệ');
        }
        if (next < 0) {
            throw new Error('Tồn kho sau kiểm kê không thể âm');
        }
        if (next < Number(inventory.quantityReserved || 0)) {
            throw new Error('Không thể điều chỉnh xuống thấp hơn số lượng đang giữ chỗ');
        }
        const delta = next - current;
        inventory.quantityOnHand = next;
        inventory.updatedAt = new Date();
        const savedInventory = await this.inventoryRepository.save(inventory);
        const transaction = this.inventoryTransactionRepository.create({
            productId: data.productId,
            transactionType: 'adjustment',
            quantity: delta,
            referenceType: 'adjustment',
            referenceId: `ADJ-${Date.now()}`,
            quantityBefore: current,
            quantityAfter: next,
            note: data.reason || data.note || 'Điều chỉnh kho',
            createdBy: data.createdBy || 'admin',
            createdAt: new Date(),
        });
        await this.inventoryTransactionRepository.save(transaction);
        return { item: savedInventory, transaction };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductService);
//# sourceMappingURL=product.service.js.map