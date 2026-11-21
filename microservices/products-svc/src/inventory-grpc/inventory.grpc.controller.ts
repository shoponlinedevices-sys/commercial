import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { OriginProductService } from 'src/services/product.service';
import { IProductSaleStock, ISaleInventory } from '../../../../packages/contracts/model/product/product.model';
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

  @GrpcMethod('InventoryService', 'SaleStock')
   async saleStock(@Payload() body: IProductSaleStock): Promise<ISaleInventory> {
      return this.productService.saleInventory(this.normalizeCreatedBy(body));
    }

  @GrpcMethod('InventoryService', 'ReturnInventory')
   async returnInventory(@Payload() body: IProductSaleStock): Promise<ISaleInventory> {
      return this.productService.returnInventory(this.normalizeCreatedBy(body));
    }

  @GrpcMethod('InventoryService', 'Summary')
   async summary(): Promise<IInventorySummary> {
      return this.productService.getInventorySummary();
    }

  @GrpcMethod('InventoryService', 'GetItems')
  async getItems(@Payload() data: any) {
     return this.productService.getInventoryList(data);
  }

  @GrpcMethod('InventoryService', 'GetItem')
  async getItem(@Payload() data: { productId: number }) {
     const detail = await this.productService.getInventoryDetail(Number(data.productId));
     if (!detail) {
       return { item: null };
     }
     const item = (detail as any).item ?? detail as any;
     return { item: { ...item, productId: item.productId, productName: item.productName ?? item.product?.name ?? '', sku: item.sku ?? item.product?.sku ?? '', quantityAvailable: item.quantityAvailable } };
  }

  @GrpcMethod('InventoryService', 'GetTransactions')
  async getTransactions(@Payload() data: any) {
     return this.productService.getInventoryTransactions({
       page: Number(data.page) || 1,
       limit: Number(data.limit) || 20,
       productId: Number(data.productId) || undefined,
       type: data.type || undefined,
     });
  }

  @GrpcMethod('InventoryService', 'ImportStock')
  async importStock(@Payload() data: any) {
     return this.productService.importInventory(this.normalizeCreatedBy(data));
  }

  @GrpcMethod('InventoryService', 'ReserveStock')
  async reserveStock(@Payload() data: IProductSaleStock) {
     return this.productService.reserveInventory(this.normalizeCreatedBy(data));
  }

  @GrpcMethod('InventoryService', 'ReleaseStock')
  async releaseStock(@Payload() data: IProductSaleStock) {
     return this.productService.releaseInventory(this.normalizeCreatedBy(data));
  }

  @GrpcMethod('InventoryService', 'AdjustStock')
  async adjustStock(@Payload() data: any) {
     return this.productService.adjustInventory(this.normalizeCreatedBy(data));
  }
}
