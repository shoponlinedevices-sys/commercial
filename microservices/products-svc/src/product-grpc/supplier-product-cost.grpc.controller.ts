import { Controller, HttpException, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
  ProductCostMutationRequest,
  SupplierMutationRequest,
} from '../../../../packages/contracts/grpc/interface/grpc-products.service';
import {
  IProductCost,
  ISupplier,
} from '../../../../packages/contracts/model/product/supplier-cost.model';
import { ProductCostInput, ProductCostView, ProductService, SupplierInput } from '../product.service';

@Controller()
export class SupplierProductCostGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'CreateSupplier')
  createSupplier(request: SupplierMutationRequest): Promise<ISupplier> {
    const input = this.supplierInput(request, true);
    return this.run(async () => this.mapSupplier(await this.productService.createSupplier(input)));
  }

  @GrpcMethod('ProductService', 'ListSuppliers')
  listSuppliers(request: {
    search: string;
    status: number;
    hasStatus: boolean;
    page: number;
    limit: number;
  }) {
    const page = this.page(request.page, 1);
    const limit = this.limit(request.limit, 20);
    return this.run(async () => {
      const result = await this.productService.listSuppliers({
        search: this.optionalSearch(request.search),
        status: request.hasStatus ? this.statusValue(request.status) : undefined,
        page,
        limit,
      });
      return { ...result, items: result.items.map((supplier) => this.mapSupplier(supplier)) };
    });
  }

  @GrpcMethod('ProductService', 'GetSupplier')
  getSupplier(request: { id: number }): Promise<ISupplier> {
    const id = this.positiveId(request.id, 'supplier id');
    return this.run(async () => {
      const supplier = await this.productService.getSupplier(id);
      if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
      return this.mapSupplier(supplier);
    });
  }

  @GrpcMethod('ProductService', 'UpdateSupplier')
  updateSupplier(request: SupplierMutationRequest): Promise<ISupplier> {
    const id = this.positiveId(request.id, 'supplier id');
    const input = this.supplierInput(request, false);
    return this.run(async () => this.mapSupplier(await this.productService.updateSupplier(id, input)));
  }

  @GrpcMethod('ProductService', 'UpdateSupplierStatus')
  updateSupplierStatus(request: { id: number; status: number }): Promise<ISupplier> {
    const id = this.positiveId(request.id, 'supplier id');
    const statusValue = this.statusValue(request.status);
    return this.run(async () => this.mapSupplier(await this.productService.updateSupplierStatus(id, statusValue)));
  }

  @GrpcMethod('ProductService', 'CreateProductCost')
  createProductCost(request: ProductCostMutationRequest): Promise<IProductCost> {
    const input = this.productCostInput(request, true);
    return this.run(async () => this.mapCost(await this.productService.createProductCost(input)));
  }

  @GrpcMethod('ProductService', 'ListProductCosts')
  listProductCosts(request: {
    productId: number;
    supplierId: number;
    search: string;
    from: string;
    to: string;
    page: number;
    limit: number;
    hasProductId: boolean;
    hasSupplierId: boolean;
  }) {
    return this.run(() => this.listCosts(request));
  }

  @GrpcMethod('ProductService', 'GetProductCost')
  getProductCost(request: { id: string }): Promise<IProductCost> {
    const id = this.bigId(request.id, 'product cost id');
    return this.run(async () => {
      const cost = await this.productService.getProductCost(id);
      if (!cost) throw new NotFoundException('Lần nhập không tồn tại');
      return this.mapCost(cost);
    });
  }

  @GrpcMethod('ProductService', 'UpdateProductCost')
  updateProductCost(request: ProductCostMutationRequest): Promise<IProductCost> {
    const id = this.bigId(request.id, 'product cost id');
    const input = this.productCostInput(request, false);
    return this.run(async () => this.mapCost(await this.productService.updateProductCost(id, input)));
  }

  @GrpcMethod('ProductService', 'ListProductCostHistory')
  listProductCostHistory(request: { productId: number; page: number; limit: number }) {
    const productId = this.positiveId(request.productId, 'product id');
    return this.run(() => this.listCosts({
      productId,
      supplierId: 0,
      search: '',
      from: '',
      to: '',
      page: request.page,
      limit: request.limit,
      hasProductId: true,
      hasSupplierId: false,
    }));
  }

  @GrpcMethod('ProductService', 'GetLatestProductCost')
  getLatestProductCost(request: { productId: number }) {
    const productId = this.positiveId(request.productId, 'product id');
    return this.run(async () => {
      const item = await this.productService.getLatestProductCost(productId);
      return { found: item !== null, item: item ? this.mapCost(item) : undefined };
    });
  }

  @GrpcMethod('ProductService', 'GetProductCostSummary')
  getProductCostSummary() {
    return this.run(async () => {
      const summary = await this.productService.getProductCostSummary();
      return {
        totalImports: String(summary.totalImports),
        totalValue: String(summary.totalValue),
        productsWithCost: String(summary.productsWithCost),
      };
    });
  }

  private async listCosts(request: {
    productId: number;
    supplierId: number;
    search: string;
    from: string;
    to: string;
    page: number;
    limit: number;
    hasProductId: boolean;
    hasSupplierId: boolean;
  }) {
    const from = this.optionalDate(request.from, 'from');
    const to = this.optionalDate(request.to, 'to');
    if (from && to && from > to) this.invalid('from must be earlier than or equal to to');
    const result = await this.productService.listProductCosts({
      productId: request.hasProductId ? this.positiveId(request.productId, 'product id') : undefined,
      supplierId: request.hasSupplierId ? this.positiveId(request.supplierId, 'supplier id') : undefined,
      search: this.optionalSearch(request.search),
      from,
      to,
      page: this.page(request.page, 1),
      limit: this.limit(request.limit, 20),
    });
    return { ...result, items: await Promise.all(result.items.map((item) => this.mapCost(item))) };
  }

  private supplierInput(request: SupplierMutationRequest, creating: boolean): SupplierInput {
    if (!request || typeof request !== 'object') this.invalid('supplier body is required');
    const input: SupplierInput = {};
    if (request.hasName || creating) input.name = this.optionalText(request.name, 'name', 255);
    if (request.hasPhone || creating) input.phone = this.optionalText(request.phone, 'phone', 20);
    if (request.hasEmail || creating) {
      input.email = this.optionalText(request.email, 'email', 100);
      if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) this.invalid('email is invalid');
    }
    if (request.hasAddress || creating) input.address = this.optionalText(request.address, 'address');
    if (request.hasTaxCode || creating) input.taxCode = this.optionalText(request.taxCode, 'taxCode', 50);
    if (request.hasNote || creating) input.note = this.optionalText(request.note, 'note');
    if (creating && !input.name) this.invalid('name is required');
    if (!creating && Object.keys(input).length === 0) this.invalid('at least one field is required');
    return input;
  }

  private productCostInput(request: ProductCostMutationRequest, creating: boolean): ProductCostInput {
    if (!request || typeof request !== 'object') this.invalid('product cost body is required');
    const input: ProductCostInput = {};
    if (request.hasProductId || creating) input.productId = this.positiveId(request.productId, 'productId');
    if (request.hasSupplierId) {
      input.supplierId = request.supplierId === 0 ? null : this.positiveId(request.supplierId, 'supplierId');
    } else if (creating) {
      input.supplierId = null;
    }
    if (request.hasImportPrice || creating) input.importPrice = this.money(request.importPrice, 'importPrice');
    if (request.hasQuantity || creating) {
      const quantity = creating && request.quantity === 0 ? 1 : request.quantity;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 2147483647) this.invalid('quantity must be a positive integer');
      input.quantity = quantity;
    }
    if (request.hasShippingFee || creating) input.shippingFee = this.money(request.shippingFee || '0', 'shippingFee');
    if (request.hasOtherFee || creating) input.otherFee = this.money(request.otherFee || '0', 'otherFee');
    if (request.hasImportDate) input.importDate = this.date(request.importDate, 'importDate');
    if (request.hasNote || creating) input.note = this.optionalText(request.note, 'note');
    if (creating && (input.productId === undefined || input.importPrice === undefined)) {
      this.invalid('productId and importPrice are required');
    }
    if (!creating && Object.keys(input).length === 0) this.invalid('at least one field is required');
    return input;
  }

  private mapSupplier(supplier: {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    taxCode: string | null;
    note: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
  }): ISupplier {
    return {
      id: supplier.id,
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      taxCode: supplier.taxCode || '',
      note: supplier.note || '',
      status: supplier.status,
      createdAt: this.isoDate(supplier.createdAt),
      updatedAt: this.isoDate(supplier.updatedAt),
    };
  }

  private mapCost(result: ProductCostView): IProductCost {
    return {
      id: result.id,
      productId: result.productId,
      productName: result.productName,
      sku: result.sku || '',
      salePrice: String(result.salePrice),
      supplierId: result.supplierId || 0,
      supplierName: result.supplierName || '',
      importPrice: String(result.importPrice),
      quantity: result.quantity,
      shippingFee: String(result.shippingFee),
      otherFee: String(result.otherFee),
      totalGoods: String(result.totalGoods),
      totalFees: String(result.totalFees),
      totalValue: String(result.totalValue),
      unitCost: String(result.unitCost),
      expectedProfit: String(result.expectedProfit),
      profitMarginPercent: result.profitMarginPercent === null ? '' : String(result.profitMarginPercent),
      hasProfitMargin: result.profitMarginPercent !== null,
      importDate: this.isoDate(result.importDate),
      note: result.note || '',
      createdAt: this.isoDate(result.createdAt),
      hasSupplier: result.supplierId !== null,
    };
  }

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof HttpException) {
        const code = error instanceof NotFoundException ? status.NOT_FOUND : status.INVALID_ARGUMENT;
        const response = error.getResponse();
        const message = typeof response === 'string'
          ? response
          : typeof response === 'object' && response !== null && 'message' in response
            ? String(response.message)
            : error.message;
        throw new RpcException({ code, message });
      }
      if (error instanceof RpcException) throw error;
      throw error;
    }
  }

  private positiveId(value: number, field: string): number {
    if (!Number.isSafeInteger(value) || value < 1) this.invalid(`${field} must be a positive integer`);
    return value;
  }

  private page(value: number, fallback: number): number {
    const page = value || fallback;
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) this.invalid('page must be between 1 and 1000000');
    return page;
  }

  private limit(value: number, fallback: number): number {
    const limit = value || fallback;
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) this.invalid('limit must be between 1 and 100');
    return limit;
  }

  private statusValue(value: number): number {
    if (value !== 0 && value !== 1) this.invalid('status must be 0 or 1');
    return value;
  }

  private optionalSearch(value: string): string | undefined {
    const search = (value || '').trim();
    if (search.length > 200) this.invalid('search must be at most 200 characters');
    return search || undefined;
  }

  private optionalText(value: string, field: string, maxLength?: number): string | null {
    const text = (value || '').trim();
    if (maxLength !== undefined && text.length > maxLength) this.invalid(`${field} must be at most ${maxLength} characters`);
    return text || null;
  }

  private money(value: string, field: string): number {
    const amount = Number(value);
    if (!/^\d{1,13}(\.\d{1,2})?$/.test(value) || !Number.isFinite(amount)) {
      this.invalid(`${field} must be a non-negative amount with up to 2 decimal places`);
    }
    return amount;
  }

  private date(value: string, field: string): Date {
    if (!value || !/(Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) {
      this.invalid(`${field} must be an ISO 8601 date with timezone`);
    }
    return new Date(value);
  }

  private optionalDate(value: string, field: string): Date | undefined {
    return value ? this.date(value, field) : undefined;
  }

  private bigId(value: string, field: string): string {
    if (!/^[1-9]\d{0,19}$/.test(value) || value.length === 20 && value > '18446744073709551615') {
      this.invalid(`${field} must be a positive unsigned 64-bit integer`);
    }
    return value;
  }

  private isoDate(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : '';
  }

  private invalid(message: string): never {
    throw new RpcException({ code: status.INVALID_ARGUMENT, message });
  }
}
