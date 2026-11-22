import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import { HistoryLogEntity } from './history-log.entity';
import { InventoryEntity } from './inventory.entity';
import { InventoryTransactionEntity } from './inventory-transaction.entity';
import { ProductCostEntity } from './product-cost.entity';
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

  private get supplierRepository() {
    return this.dataSource.getRepository(SupplierEntity);
  }

  private get productCostRepository() {
    return this.dataSource.getRepository(ProductCostEntity);
  }

  async createSupplier(input: SupplierInput) {
    if (!input.name?.trim()) throw new BadRequestException('Tên nhà cung cấp là bắt buộc');
    const supplier = this.supplierRepository.create({
      name: input.name.trim(),
      phone: input.phone ?? null,
      email: input.email ?? null,
      address: input.address ?? null,
      taxCode: input.taxCode ?? null,
      note: input.note ?? null,
      status: 1,
    });
    return this.supplierRepository.save(supplier);
  }

  async listSuppliers(filters: { search?: string; status?: number; page: number; limit: number }) {
    const query = this.supplierRepository.createQueryBuilder('supplier');
    if (filters.search) {
      query.andWhere('(supplier.name LIKE :search OR supplier.phone LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }
    if (filters.status !== undefined) query.andWhere('supplier.status = :status', { status: filters.status });
    const [items, total] = await query
      .orderBy('supplier.id', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();
    return { items, total, page: filters.page, limit: filters.limit };
  }

  getSupplier(id: number) {
    return this.supplierRepository.findOne({ where: { id } });
  }

  async updateSupplier(id: number, input: SupplierInput) {
    const supplier = await this.getSupplier(id);
    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
    if (input.name !== undefined) {
      if (!input.name?.trim()) throw new BadRequestException('Tên nhà cung cấp là bắt buộc');
      supplier.name = input.name.trim();
    }
    if (input.phone !== undefined) supplier.phone = input.phone;
    if (input.email !== undefined) supplier.email = input.email;
    if (input.address !== undefined) supplier.address = input.address;
    if (input.taxCode !== undefined) supplier.taxCode = input.taxCode;
    if (input.note !== undefined) supplier.note = input.note;
    return this.supplierRepository.save(supplier);
  }

  async updateSupplierStatus(id: number, status: number) {
    const supplier = await this.getSupplier(id);
    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
    supplier.status = status;
    return this.supplierRepository.save(supplier);
  }

  async createProductCost(input: ProductCostInput) {
    if (input.productId === undefined || input.importPrice === undefined) {
      throw new BadRequestException('Sản phẩm và giá nhập là bắt buộc');
    }
    await this.ensureCostProduct(input.productId);
    await this.ensureCostSupplier(input.supplierId);
    const cost = this.productCostRepository.create({
      productId: input.productId,
      supplierId: input.supplierId ?? null,
      importPrice: String(input.importPrice),
      quantity: input.quantity ?? 1,
      shippingFee: String(input.shippingFee ?? 0),
      otherFee: String(input.otherFee ?? 0),
      importDate: input.importDate,
      note: input.note ?? null,
    });
    return this.productCostResponse(await this.productCostRepository.save(cost));
  }

  async updateProductCost(id: string, input: ProductCostInput) {
    const cost = await this.productCostRepository.findOne({ where: { id } });
    if (!cost) throw new NotFoundException('Lần nhập không tồn tại');
    if (Object.keys(input).length === 0) throw new BadRequestException('Cần có ít nhất một trường để cập nhật');
    if (input.productId !== undefined) {
      await this.ensureCostProduct(input.productId);
      cost.productId = input.productId;
    }
    if (input.supplierId !== undefined) {
      if (input.supplierId !== cost.supplierId) {
        await this.ensureCostSupplier(input.supplierId);
        cost.supplierId = input.supplierId;
      }
    }
    if (input.importPrice !== undefined) cost.importPrice = String(input.importPrice);
    if (input.quantity !== undefined) cost.quantity = input.quantity;
    if (input.shippingFee !== undefined) cost.shippingFee = String(input.shippingFee);
    if (input.otherFee !== undefined) cost.otherFee = String(input.otherFee);
    if (input.importDate !== undefined) cost.importDate = input.importDate;
    if (input.note !== undefined) cost.note = input.note;
    return this.productCostResponse(await this.productCostRepository.save(cost));
  }

  async listProductCosts(filters: {
    productId?: number;
    supplierId?: number;
    search?: string;
    from?: Date;
    to?: Date;
    page: number;
    limit: number;
  }) {
    const query = this.productCostRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.product', 'product')
      .leftJoinAndSelect('cost.supplier', 'supplier');
    if (filters.productId !== undefined) query.andWhere('cost.productId = :productId', { productId: filters.productId });
    if (filters.supplierId !== undefined) query.andWhere('cost.supplierId = :supplierId', { supplierId: filters.supplierId });
    if (filters.search) {
      query.andWhere('(product.name LIKE :search OR product.sku LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }
    if (filters.from) query.andWhere('cost.importDate >= :from', { from: filters.from });
    if (filters.to) query.andWhere('cost.importDate <= :to', { to: filters.to });
    const [items, total] = await query
      .orderBy('cost.importDate', 'DESC')
      .addOrderBy('cost.id', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();
    return {
      items: await Promise.all(items.map((item) => this.productCostResponse(item))),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  async getProductCost(id: string) {
    const cost = await this.productCostRepository.findOne({
      where: { id },
      relations: ['product', 'supplier'],
    });
    return cost ? this.productCostResponse(cost) : null;
  }

  async getLatestProductCost(productId: number) {
    await this.ensureCostProduct(productId);
    const cost = await this.productCostRepository.findOne({
      where: { productId },
      relations: ['product', 'supplier'],
      order: { importDate: 'DESC', id: 'DESC' },
    });
    return cost ? this.productCostResponse(cost) : null;
  }

  async getProductCostSummary() {
    const row = await this.productCostRepository
      .createQueryBuilder('cost')
      .select('COUNT(*)', 'totalImports')
      .addSelect('COALESCE(SUM(cost.import_price * cost.quantity + cost.shipping_fee + cost.other_fee), 0)', 'totalValue')
      .addSelect('COUNT(DISTINCT cost.product_id)', 'productsWithCost')
      .getRawOne();
    return {
      totalImports: Number(row?.totalImports || 0),
      totalValue: Number(row?.totalValue || 0),
      productsWithCost: Number(row?.productsWithCost || 0),
    };
  }

  private async ensureCostProduct(productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  private async ensureCostSupplier(supplierId?: number | null) {
    if (supplierId == null) return null;
    const supplier = await this.getSupplier(supplierId);
    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
    if (supplier.status !== 1) throw new BadRequestException('Nhà cung cấp đã bị khóa');
    return supplier;
  }

  private async productCostResponse(cost: ProductCostEntity): Promise<ProductCostView> {
    const product = cost.product || await this.ensureCostProduct(cost.productId);
    const supplier = cost.supplierId == null
      ? null
      : cost.supplier || await this.getSupplier(cost.supplierId);
    const importPrice = Number(cost.importPrice);
    const shippingFee = Number(cost.shippingFee);
    const otherFee = Number(cost.otherFee);
    const totalGoodsCents = this.moneyToCents(cost.importPrice) * BigInt(cost.quantity);
    const totalFeesCents = this.moneyToCents(cost.shippingFee) + this.moneyToCents(cost.otherFee);
    const totalCostCents = totalGoodsCents + totalFeesCents;
    const totalGoods = Number(totalGoodsCents) / 100;
    const totalFees = Number(totalFeesCents) / 100;
    const totalCost = Number(totalCostCents) / 100;
    const unitCost = cost.quantity > 0 ? totalCost / cost.quantity : 0;
    const salePrice = Number(product.price || 0);
    const expectedProfit = salePrice - unitCost;
    return {
      id: cost.id,
      productId: cost.productId,
      productName: product.name,
      sku: product.sku,
      salePrice,
      supplierId: cost.supplierId,
      supplierName: supplier?.name ?? null,
      importPrice,
      quantity: cost.quantity,
      shippingFee,
      otherFee,
      totalGoods,
      totalFees,
      totalValue: totalCost,
      unitCost,
      expectedProfit,
      profitMarginPercent: unitCost > 0 ? expectedProfit / unitCost * 100 : null,
      importDate: cost.importDate,
      note: cost.note,
      createdAt: cost.createdAt,
    };
  }

  private moneyToCents(value: string): bigint {
    const [whole, fraction = ''] = String(value).split('.');
    return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
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

  async getFeaturedProducts(): Promise<IGetProductsResponse> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.isFeatured = :isFeatured', { isFeatured: 1 })
      .andWhere('product.image IS NOT NULL')
      .andWhere("product.image <> ''")
      .orderBy('product.id', 'DESC')
      .getMany();

    return {
      products: await this.addAvailableQuantity(products),
      total: products.length,
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

  async getProductsGroupedByCategory(filters?: IGetProductsGroupedByCategoryRequest): Promise<IGetProductsGroupedByCategoryResponse> {
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

    return {
      categories: categories.map((category) => ({
        ...category,
        isActive: category.is_active,
        products: (category.products || []).map((product) => ({
          ...product,
          quantityAvailable: quantityByProductId.get(product.id) ?? 0,
        })),
      })),
    };
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

  async findOne(id: Id): Promise<IProduct> {
    const product = await this.productRepository.findOne({ where: { id: id.id } });
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product }; 
  }

  async findAll(input: IFindProducts): Promise<IGetProductsResponse> {
    const products = await this.productRepository.find({
      where: input.categoryId ? { categoryId: input.categoryId } : {},
    });
    return {
      products: products.map(product => ({ ...product })),
      total: products.length
    };
  }

}
