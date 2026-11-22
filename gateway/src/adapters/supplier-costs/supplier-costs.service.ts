import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { IGrpcProductService, ProductCostMutationRequest, SupplierMutationRequest } from '../../../../packages/contracts/grpc/interface/grpc-products.service';
import { IProductCost, ISupplier } from '../../../../packages/contracts/model/product/supplier-cost.model';

type SupplierWriteBody = Record<string, unknown>;
type CostWriteBody = Record<string, unknown>;

@Injectable()
export class SupplierCostsService implements OnModuleInit {
  private products!: IGrpcProductService;

  constructor(@Inject('GRPC_PRODUCTS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.products = this.client.getService<IGrpcProductService>('ProductService');
  }

  async listSuppliers(query: Record<string, unknown>) {
    const status = query.status === undefined || query.status === '' ? undefined : this.status(query.status);
    const result = await this.execute(() => this.products.listSuppliers({
      search: this.optionalString(query.search, 'search'),
      status: status ?? 0,
      hasStatus: status !== undefined,
      page: this.integer(query.page, 1, 'page', 1, 1000000),
      limit: this.integer(query.limit, 20, 'limit', 1, 100),
    }));
    return { ...result, items: result.items.map((item) => this.mapSupplier(item)) };
  }

  getSupplier(id: string) {
    return this.execute(() => this.products.getSupplier({ id: this.positiveInteger(id, 'supplier id') }))
      .then((supplier) => this.mapSupplier(supplier));
  }

  createSupplier(body: SupplierWriteBody) {
    const mutation = this.supplierMutation(body, 0);
    return this.execute(() => this.products.createSupplier(mutation)).then((supplier) => this.mapSupplier(supplier));
  }

  updateSupplier(id: string, body: SupplierWriteBody) {
    const mutation = this.supplierMutation(body, this.positiveInteger(id, 'supplier id'));
    return this.execute(() => this.products.updateSupplier(mutation)).then((supplier) => this.mapSupplier(supplier));
  }

  updateSupplierStatus(id: string, body: SupplierWriteBody) {
    this.assertBody(body);
    const status = this.status(body.status);
    return this.execute(() => this.products.updateSupplierStatus({
      id: this.positiveInteger(id, 'supplier id'),
      status,
    })).then((supplier) => this.mapSupplier(supplier));
  }

  async listProductCosts(query: Record<string, unknown>) {
    const productId = query.productId === undefined || query.productId === '' ? undefined : this.positiveInteger(query.productId, 'productId');
    const supplierId = query.supplierId === undefined || query.supplierId === '' ? undefined : this.positiveInteger(query.supplierId, 'supplierId');
    const result = await this.execute(() => this.products.listProductCosts({
      productId: productId ?? 0,
      supplierId: supplierId ?? 0,
      hasProductId: productId !== undefined,
      hasSupplierId: supplierId !== undefined,
      search: this.optionalString(query.search, 'search'),
      from: this.optionalString(query.from, 'from'),
      to: this.optionalString(query.to, 'to'),
      page: this.integer(query.page, 1, 'page', 1, 1000000),
      limit: this.integer(query.limit, 20, 'limit', 1, 100),
    }));
    return { ...result, items: result.items.map((item) => this.mapCost(item)) };
  }

  async listProductHistory(productId: string, query: Record<string, unknown>) {
    const result = await this.execute(() => this.products.listProductCostHistory({
      productId: this.positiveInteger(productId, 'productId'),
      page: this.integer(query.page, 1, 'page', 1, 1000000),
      limit: this.integer(query.limit, 20, 'limit', 1, 100),
    }));
    return { ...result, items: result.items.map((item) => this.mapCost(item)) };
  }

  async getLatestProductCost(productId: string) {
    const result = await this.execute(() => this.products.getLatestProductCost({
      productId: this.positiveInteger(productId, 'productId'),
    }));
    return { item: result.found && result.item ? this.mapCost(result.item) : null };
  }

  getProductCost(id: string) {
    return this.execute(() => this.products.getProductCost({ id: this.bigId(id, 'product cost id') }))
      .then((cost) => this.mapCost(cost));
  }

  createProductCost(body: CostWriteBody) {
    const mutation = this.costMutation(body, '');
    return this.execute(() => this.products.createProductCost(mutation)).then((cost) => this.mapCost(cost));
  }

  updateProductCost(id: string, body: CostWriteBody) {
    const mutation = this.costMutation(body, this.bigId(id, 'product cost id'));
    return this.execute(() => this.products.updateProductCost(mutation)).then((cost) => this.mapCost(cost));
  }

  async getProductCostSummary() {
    const result = await this.execute(() => this.products.getProductCostSummary({}));
    return {
      totalImports: Number(result.totalImports),
      totalValue: Number(result.totalValue),
      productsWithCost: Number(result.productsWithCost),
    };
  }

  private supplierMutation(body: SupplierWriteBody, id: number): SupplierMutationRequest {
    this.assertBody(body);
    return {
      id,
      name: this.stringField(body, 'name'),
      phone: this.stringField(body, 'phone'),
      email: this.stringField(body, 'email'),
      address: this.stringField(body, 'address'),
      taxCode: this.stringField(body, 'taxCode'),
      note: this.stringField(body, 'note'),
      hasName: this.has(body, 'name'),
      hasPhone: this.has(body, 'phone'),
      hasEmail: this.has(body, 'email'),
      hasAddress: this.has(body, 'address'),
      hasTaxCode: this.has(body, 'taxCode'),
      hasNote: this.has(body, 'note'),
    };
  }

  private costMutation(body: CostWriteBody, id: string): ProductCostMutationRequest {
    this.assertBody(body);
    const supplierValue = body.supplierId;
    return {
      id,
      productId: this.integer(body.productId, 0, 'productId', 0, 2147483647),
      supplierId: supplierValue === null || supplierValue === '' || supplierValue === undefined
        ? 0
        : this.integer(supplierValue, 0, 'supplierId', 0, 2147483647),
      importPrice: this.decimalField(body.importPrice),
      quantity: this.integer(body.quantity, 0, 'quantity', 0, 2147483647),
      shippingFee: this.decimalField(body.shippingFee),
      otherFee: this.decimalField(body.otherFee),
      importDate: this.stringField(body, 'importDate'),
      note: this.stringField(body, 'note'),
      hasProductId: this.has(body, 'productId'),
      hasSupplierId: this.has(body, 'supplierId'),
      hasImportPrice: this.has(body, 'importPrice'),
      hasQuantity: this.has(body, 'quantity'),
      hasShippingFee: this.has(body, 'shippingFee'),
      hasOtherFee: this.has(body, 'otherFee'),
      hasImportDate: this.has(body, 'importDate'),
      hasNote: this.has(body, 'note'),
    };
  }

  private mapSupplier(supplier: ISupplier) {
    return {
      ...supplier,
      phone: supplier.phone || null,
      email: supplier.email || null,
      address: supplier.address || null,
      taxCode: supplier.taxCode || null,
      note: supplier.note || null,
    };
  }

  private mapCost(cost: IProductCost) {
    return {
      id: cost.id,
      productId: cost.productId,
      productName: cost.productName,
      sku: cost.sku,
      salePrice: Number(cost.salePrice),
      supplierId: cost.hasSupplier ? cost.supplierId : null,
      supplierName: cost.hasSupplier ? cost.supplierName : null,
      importPrice: Number(cost.importPrice),
      quantity: cost.quantity,
      shippingFee: Number(cost.shippingFee),
      otherFee: Number(cost.otherFee),
      totalGoods: Number(cost.totalGoods),
      totalFees: Number(cost.totalFees),
      totalValue: Number(cost.totalValue),
      unitCost: Number(cost.unitCost),
      expectedProfit: Number(cost.expectedProfit),
      profitMarginPercent: cost.hasProfitMargin ? Number(cost.profitMarginPercent) : null,
      importDate: cost.importDate,
      note: cost.note || null,
      createdAt: cost.createdAt,
    };
  }

  private async execute<T>(request: () => Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request());
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? Number(error.code)
        : undefined;
      const message = typeof error === 'object' && error !== null
        ? ('details' in error && typeof error.details === 'string'
          ? error.details
          : 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'products-svc request failed')
        : 'products-svc request failed';
      if (code === 3) throw new BadRequestException(message);
      if (code === 5) throw new NotFoundException(message);
      if (code === 6) throw new BadRequestException(message);
      if (code === 7) throw new BadGatewayException(message);
      if (code === 14) throw new ServiceUnavailableException('products-svc is unavailable');
      if (code === 16) throw new BadGatewayException(message);
      if (code !== undefined) throw new BadGatewayException(message);
      throw error;
    }
  }

  private has(body: Record<string, unknown>, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(body, key);
  }

  private assertBody(body: unknown): asserts body is Record<string, unknown> {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new BadRequestException('Request body must be an object');
    }
  }

  private stringField(body: Record<string, unknown>, key: string): string {
    const value = body[key];
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') throw new BadRequestException(`${key} must be a string`);
    return value;
  }

  private decimalField(value: unknown): string {
    if (value === undefined || value === null) return '';
    if (typeof value !== 'number' && typeof value !== 'string') throw new BadRequestException('Money values must be numeric');
    return String(value);
  }

  private optionalString(value: unknown, field: string): string {
    if (value === undefined || value === '') return '';
    if (typeof value !== 'string') throw new BadRequestException(`${field} must be a string`);
    return value;
  }

  private integer(value: unknown, fallback: number, field: string, min: number, max: number): number {
    if (value === undefined || value === '') return fallback;
    const parsed = typeof value === 'number'
      ? value
      : typeof value === 'string' && /^\d+$/.test(value)
        ? Number(value)
        : Number.NaN;
    if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
      throw new BadRequestException(`${field} must be an integer between ${min} and ${max}`);
    }
    return parsed;
  }

  private positiveInteger(value: unknown, field: string): number {
    return this.integer(value, 0, field, 1, 2147483647);
  }

  private status(value: unknown): number {
    if (value === 0 || value === '0') return 0;
    if (value === 1 || value === '1') return 1;
    throw new BadRequestException('status must be 0 or 1');
  }

  private bigId(value: string, field: string): string {
    if (!/^[1-9]\d{0,19}$/.test(value) || value.length === 20 && value > '18446744073709551615') {
      throw new BadRequestException(`${field} is invalid`);
    }
    return value;
  }
}
