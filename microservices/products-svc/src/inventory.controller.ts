import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('inventory')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private readonly productService: ProductService) {}

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

  @Get('summary')
  async getSummary() {
    return this.productService.getInventorySummary();
  }

  @Get()
  async getInventory(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('category') category = '',
    @Query('status') status = '',
  ) {
    return this.productService.getInventoryList({
      page: Number(page),
      limit: Number(limit),
      search,
      category,
      status,
    });
  }

  @Get('transactions')
  async getTransactions(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('productId') productId?: string,
    @Query('type') type?: string,
  ) {
    return this.productService.getInventoryTransactions({
      page: Number(page),
      limit: Number(limit),
      productId: productId ? Number(productId) : undefined,
      type,
    });
  }

  @Get(':productId')
  async getInventoryDetail(@Param('productId') productId: string) {
    return this.productService.getInventoryDetail(Number(productId));
  }

  @Post('import')
  async importStock(@Body() body: {
    productId: number;
    quantity: number;
    unitCost?: number;
    reference?: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.importInventory(this.normalizeCreatedBy(body));
  }

  @Post('reserve')
  async reserveStock(@Body() body: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.reserveInventory(this.normalizeCreatedBy(body));
  }

  @Post('release')
  async releaseStock(@Body() body: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.releaseInventory(this.normalizeCreatedBy(body));
  }

  @Post('sale')
  async saleStock(@Body() body: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.saleInventory(this.normalizeCreatedBy(body));
  }

  @Post('return')
  async returnStock(@Body() body: {
    productId: number;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.returnInventory(this.normalizeCreatedBy(body));
  }

  @Post('adjustments')
  async adjustStock(@Body() body: {
    productId: number;
    quantityAfter: number;
    reason: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.adjustInventory(this.normalizeCreatedBy(body));
  }
}
