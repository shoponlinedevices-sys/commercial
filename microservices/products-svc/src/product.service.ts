import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import { HistoryLogEntity } from './history-log.entity';
import { InventoryEntity } from './inventory.entity';
import { InventoryTransactionEntity } from './inventory-transaction.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  private get productRepository() {
    return this.dataSource.getRepository(ProductEntity);
  }

  private get inventoryRepository() {
    return this.dataSource.getRepository(InventoryEntity);
  }

  private get inventoryTransactionRepository() {
    return this.dataSource.getRepository(InventoryTransactionEntity);
  }

  private async addAvailableQuantity<T extends { id: number }>(
    products: T[],
  ): Promise<Array<T & { quantityAvailable: number }>> {
    if (products.length === 0) {
      return [];
    }

    const inventoryRows = await this.inventoryRepository.find({
      where: { productId: In(products.map((product) => product.id)) },
      select: ['productId', 'quantityOnHand', 'quantityReserved'],
    });
    const quantityByProductId = new Map<number, number>();

    inventoryRows.forEach((inventory) => {
      quantityByProductId.set(
        inventory.productId,
        Math.max(0, Number(inventory.quantityOnHand || 0) - Number(inventory.quantityReserved || 0)),
      );
    });

    return products.map((product) => ({
      ...product,
      quantityAvailable: quantityByProductId.get(product.id) ?? 0,
    }));
  }

  async getHistoryLogs(limit = 200) {
    return this.dataSource.getRepository(HistoryLogEntity).find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 500),
    });
  }

  async getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filters?.search) {
      queryBuilder.andWhere('product.name LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters?.category) {
      // Query category table to get ID from name
      const categoryRepo = this.dataSource.getRepository(CategoryEntity);
      const category = await categoryRepo.findOne({
        where: { name: filters.category, is_active: 1 },
      });

      if (category) {
        queryBuilder.andWhere('product.category = :category', {
          category: category.id.toString(),
        });
      } else {
        // If category name not found, try direct match (for backward compatibility)
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
      products: await this.addAvailableQuantity(products),
      total,
    };
  }

  async getProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return { product };
  }

  async createProduct(input: {
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
  }) {
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
    await this.dataSource.getRepository(HistoryLogEntity).save({
      action: 'CREATE',
      entityType: 'PRODUCT',
      entityId: String(savedProduct.id),
      source: 'products-svc',
      createdBy: input.createdBy || 'system',
      metadata: { name: savedProduct.name, price: savedProduct.price, sku: savedProduct.sku },
    });
    return { product: savedProduct };
  }

  async getProductsGroupedByCategory(filters?: {
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
  }) {
    const categoryRepository = this.dataSource.getRepository(CategoryEntity);

    const queryBuilder = categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndMapMany(
        'category.products',
        ProductEntity,
        'product',
        'product.categoryId = category.id',
      )

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
    const productsWithQuantity = await this.addAvailableQuantity(
      categories.flatMap((category) => category.products || []),
    );
    const quantityByProductId = new Map<number, number>();
    productsWithQuantity.forEach((product) => {
      quantityByProductId.set(product.id, product.quantityAvailable);
    });

    return categories.map((category) => ({
      ...category,
      products: (category.products || []).map((product) => ({
        ...product,
        quantityAvailable: quantityByProductId.get(product.id) ?? 0,
      })),
    }));
  }

  async getInventorySummary() {
    const inventoryRows = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndMapOne('inventory.product', ProductEntity, 'product', 'product.id = inventory.productId')
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

  async getInventoryList(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }) {
    const page = Math.max(1, Number(filters?.page || 1));
    const limit = Math.max(1, Math.min(100, Number(filters?.limit || 10)));
    const skip = (page - 1) * limit;

    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndMapOne('inventory.product', ProductEntity, 'product', 'product.id = inventory.productId')
      .leftJoinAndMapOne('product.category', CategoryEntity, 'category', 'category.id = product.categoryId');

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
      } else if (quantityAvailable <= Number(item.reorderLevel || 0)) {
        status = 'Sắp hết hàng';
      }

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product?.name || 'Sản phẩm',
        sku: item.product?.sku || '',
        category: item.product?.categoryId ? (item.product as any).category?.name || 'Chưa phân loại' : 'Chưa phân loại',
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

  async getInventoryDetail(productId: number) {
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

  async getInventoryTransactions(filters?: {
    page?: number;
    limit?: number;
    productId?: number;
    type?: string;
  }) {
    const page = Math.max(1, Number(filters?.page || 1));
    const limit = Math.max(1, Math.min(100, Number(filters?.limit || 20)));
    const skip = (page - 1) * limit;

    const queryBuilder = this.inventoryTransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapOne('transaction.product', ProductEntity, 'product', 'product.id = transaction.productId')
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

  private async ensureProductExists(productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }
    return product;
  }

  private async ensureInventoryRecord(productId: number) {
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

  async importInventory(data: {
    productId: number;
    quantity: number;
    unitCost?: number;
    reference?: string;
    note?: string;
    createdBy?: number;
  }) {
    const productId = Number(data.productId);
    const quantity = Number(data.quantity || 0);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error('Mã sản phẩm không hợp lệ');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Số lượng nhập phải là số nguyên lớn hơn 0');
    }

    return this.dataSource.transaction(async (manager) => {
      const product = await manager.getRepository(ProductEntity).findOne({ where: { id: productId } });
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      await manager.query(
        'INSERT INTO tbl_inventory (product_id, quantity_on_hand, quantity_reserved, reorder_level) VALUES (?, 0, 0, 0) ON DUPLICATE KEY UPDATE product_id = product_id',
        [productId],
      );

      const inventory = await manager.getRepository(InventoryEntity)
        .createQueryBuilder('inventory')
        .setLock('pessimistic_write')
        .where('inventory.productId = :productId', { productId })
        .getOne();
      if (!inventory) {
        throw new Error('Không thể khởi tạo tồn kho cho sản phẩm');
      }

      const before = Number(inventory.quantityOnHand || 0);
      inventory.quantityOnHand = before + quantity;
      inventory.updatedAt = new Date();
      const savedInventory = await manager.getRepository(InventoryEntity).save(inventory);

      const transaction = manager.getRepository(InventoryTransactionEntity).create({
        productId,
        transactionType: 'import',
        quantity,
        referenceType: 'purchase',
        referenceId: data.reference || `INV-IMP-${Date.now()}`,
        quantityBefore: before,
        quantityAfter: savedInventory.quantityOnHand,
        note: data.note || 'Nhập kho',
        createdBy: data.createdBy,
        createdAt: new Date(),
      });

      const savedTransaction = await manager.getRepository(InventoryTransactionEntity).save(transaction);
      return { item: savedInventory, transaction: savedTransaction };
    });
  }

  async reserveInventory(data: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
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
      createdBy: data.createdBy,
      createdAt: new Date(),
    });

    await this.inventoryTransactionRepository.save(transaction);
    return { item: savedInventory, transaction };
  }

  async releaseInventory(data: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
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
      createdBy: data.createdBy,
      createdAt: new Date(),
    });

    await this.inventoryTransactionRepository.save(transaction);
    return { item: savedInventory, transaction };
  }

  async saleInventory(data: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
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
      createdBy: data.createdBy,
      createdAt: new Date(),
    });

    await this.inventoryTransactionRepository.save(transaction);
    return { item: savedInventory, transaction };
  }

  async returnInventory(data: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
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
      createdBy: data.createdBy,
      createdAt: new Date(),
    });

    await this.inventoryTransactionRepository.save(transaction);
    return { item: savedInventory, transaction };
  }

  async adjustInventory(data: {
    productId: number;
    quantityAfter: number;
    reason: string;
    note?: string;
    createdBy?: number;
  }) {
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
      createdBy: data.createdBy,
      createdAt: new Date(),
    });

    await this.inventoryTransactionRepository.save(transaction);
    return { item: savedInventory, transaction };
  }
}
