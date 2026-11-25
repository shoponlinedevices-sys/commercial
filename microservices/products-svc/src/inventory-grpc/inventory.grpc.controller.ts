import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { OriginProductService } from 'src/services/product.service';
import { IProductSaleStock } from '../../../../packages/contracts/model/product/product.model';
import { IInventorySummary } from '../../../../packages/contracts/model/inventory/inventory.model';

@Controller()
export class InventoryGrpcController {
  private readonly logger = new Logger(InventoryGrpcController.name);
  constructor(
    private readonly productService: OriginProductService,
  ) {}

    private normalizeCreatedBy<T extends { createdBy?: number }>(body: T): T {
    const rawCreatedBy = body.createdBy as unknown;
    if (rawCreatedBy === undefined || rawCreatedBy === null) {
      return body;
    }

    const createdBy = typeof rawCreatedBy === 'number'
      ? rawCreatedBy
      : typeof rawCreatedBy === 'string' && /^\d+$/.test(rawCreatedBy)
        ? Number(rawCreatedBy)
        : Number.NaN;

    if (Number.isSafeInteger(createdBy) && createdBy > 0) {
      return { ...body, createdBy };
    }

    this.logger.warn(`Ignoring non-numeric inventory createdBy value: ${String(rawCreatedBy)}`);
    return { ...body, createdBy: undefined };
  }

  private toProtoTimestamp(value: Date | string | undefined): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value || '';
  }

  private serializeInventoryResult<T extends {
    item: { createdAt?: Date | string; updatedAt?: Date | string };
    transaction: { createdAt?: Date | string };
  }>(result: T) {
    return {
      ...result,
      item: {
        ...result.item,
        createdAt: this.toProtoTimestamp(result.item.createdAt),
        updatedAt: this.toProtoTimestamp(result.item.updatedAt),
      },
      transaction: {
        ...result.transaction,
        createdAt: this.toProtoTimestamp(result.transaction.createdAt),
      },
    };
  }

  @GrpcMethod('InventoryService', 'SaleStock')
   async saleStock(@Payload() body: IProductSaleStock) {
      return this.serializeInventoryResult(await this.productService.saleInventory(this.normalizeCreatedBy(body)));
    }

  @GrpcMethod('InventoryService', 'ReturnInventory')
   async returnInventory(@Payload() body: IProductSaleStock) {
      return this.serializeInventoryResult(await this.productService.returnInventory(this.normalizeCreatedBy(body)));
    }

  @GrpcMethod('InventoryService', 'Summary')
   async summary(): Promise<IInventorySummary> {
      return this.productService.getInventorySummary();
    }

  @GrpcMethod('InventoryService', 'GetItems')
  async getItems(@Payload() data: any) {
     const response = await this.productService.getInventoryList(data);
     return {
       ...response,
       items: response.items.map((item) => ({
         ...item,
         updatedAt: this.toProtoTimestamp(item.updatedAt),
       })),
     };
  }

  @GrpcMethod('InventoryService', 'GetItem')
  async getItem(@Payload() data: { productId: number }) {
     const detail = await this.productService.getInventoryDetail(Number(data.productId));
     if (!detail) {
       return { item: null };
     }
     const item = (detail as any).item ?? detail as any;
     return {
       item: {
         ...item,
         productId: item.productId,
         productName: item.productName ?? item.product?.name ?? '',
         sku: item.sku ?? item.product?.sku ?? '',
         quantityAvailable: item.quantityAvailable,
         updatedAt: this.toProtoTimestamp(item.updatedAt),
       },
     };
  }

  @GrpcMethod('InventoryService', 'GetTransactions')
  async getTransactions(@Payload() data: any) {
     const response = await this.productService.getInventoryTransactions({
       page: Number(data.page) || 1,
       limit: Number(data.limit) || 20,
       productId: Number(data.productId) || undefined,
       type: data.type || undefined,
     });
     return {
       ...response,
       items: response.items.map((item) => ({
         ...item,
         createdAt: this.toProtoTimestamp(item.createdAt),
       })),
     };
  }

  @GrpcMethod('InventoryService', 'ImportStock')
  async importStock(@Payload() data: any) {
     return this.serializeInventoryResult(await this.productService.importInventory(this.normalizeCreatedBy(data)));
  }

  @GrpcMethod('InventoryService', 'ReserveStock')
  async reserveStock(@Payload() data: IProductSaleStock) {
     return this.serializeInventoryResult(await this.productService.reserveInventory(this.normalizeCreatedBy(data)));
  }

  @GrpcMethod('InventoryService', 'ReleaseStock')
  async releaseStock(@Payload() data: IProductSaleStock) {
     return this.serializeInventoryResult(await this.productService.releaseInventory(this.normalizeCreatedBy(data)));
  }

  @GrpcMethod('InventoryService', 'AdjustStock')
  async adjustStock(@Payload() data: any) {
     return this.serializeInventoryResult(await this.productService.adjustInventory(this.normalizeCreatedBy(data)));
  }
}
