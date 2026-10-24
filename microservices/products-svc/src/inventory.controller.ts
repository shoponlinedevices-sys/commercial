import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly productService: ProductService) {}

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
    return this.productService.importInventory(body);
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
    return this.productService.reserveInventory(body);
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
    return this.productService.releaseInventory(body);
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
    return this.productService.saleInventory(body);
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
    return this.productService.returnInventory(body);
  }

  @Post('adjustments')
  async adjustStock(@Body() body: {
    productId: number;
    quantityAfter: number;
    reason: string;
    note?: string;
    createdBy?: number;
  }) {
    return this.productService.adjustInventory(body);
  }
}
