import { Body, Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OriginProductService } from 'src/services/product.service';
import { IProductSaleStock, ISaleInventory } from '../../../../packages/contracts/model/product/product.model';

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
   async saleStock(@Body() body: {
     input: IProductSaleStock
    }): Promise<ISaleInventory> {
      return this.productService.saleInventory(this.normalizeCreatedBy({...body.input}));
    }
}
