import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { InventoryService } from '../../application/inventory/inventory.service';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get inventory summary metrics' })
  @ApiResponse({ status: 200, description: 'Summary retrieved successfully' })
  getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated inventory list' })
  @ApiResponse({ status: 200, description: 'Inventory list retrieved successfully' })
  getItems(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('category') category = '',
    @Query('status') status = '',
  ) {
    return this.inventoryService.getItems(Number(page), Number(limit), search, category, status);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory detail by product ID' })
  @ApiResponse({ status: 200, description: 'Detail retrieved successfully' })
  async getItem(@Param('productId') productId: string) {
    const item = await this.inventoryService.getItem(Number(productId));
    if (!item || !item.item) {
      return { item: null };
    }
    const actualItem = item.item;
    const quantityAvailable = actualItem.quantityOnHand - actualItem.quantityReserved;
    return {
      ...actualItem,
      quantityAvailable,
      status: quantityAvailable <= 0 ? 'Hết hàng' : (quantityAvailable <= actualItem.reorderLevel ? 'Sắp hết hàng' : 'Còn hàng'),
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get inventory transaction history' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  getTransactions(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('productId') productId?: string,
    @Query('type') type?: string,
  ) {
    return this.inventoryService.getTransactions(Number(page), Number(limit), productId ? Number(productId) : undefined, type);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import stock into inventory' })
  @ApiResponse({ status: 201, description: 'Stock imported successfully' })
  importStock(@Body() body: { productId: number; quantity: number; unitCost?: number; reference?: string; note?: string }, @Req() request: any) {
    return this.inventoryService.importStock({ ...body, createdBy: request.user.id });
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve inventory for an order or pending demand' })
  @ApiResponse({ status: 201, description: 'Stock reserved successfully' })
  reserveStock(@Body() body: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string }, @Req() request: any) {
    return this.inventoryService.reserveStock({ ...body, createdBy: request.user.id });
  }

  @Post('release')
  @ApiOperation({ summary: 'Release previously reserved inventory' })
  @ApiResponse({ status: 200, description: 'Reserved stock released successfully' })
  releaseStock(@Body() body: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string }, @Req() request: any) {
    return this.inventoryService.releaseStock({ ...body, createdBy: request.user.id });
  }

  @Post('sale')
  @ApiOperation({ summary: 'Deduct sold inventory from available stock' })
  @ApiResponse({ status: 200, description: 'Sale stock deducted successfully' })
  saleStock(@Body() body: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string }, @Req() request: any) {
    return this.inventoryService.saleStock({ ...body, createdBy: request.user.id });
  }

  @Post('return')
  @ApiOperation({ summary: 'Return inventory from a sale or customer return' })
  @ApiResponse({ status: 200, description: 'Returned stock restored successfully' })
  returnStock(@Body() body: { productId: number; quantity: number; referenceType?: string; referenceId?: string; note?: string }, @Req() request: any) {
    return this.inventoryService.returnStock({ ...body, createdBy: request.user.id });
  }

  @Post('adjustments')
  @ApiOperation({ summary: 'Adjust inventory after stock take' })
  @ApiResponse({ status: 200, description: 'Inventory adjusted successfully' })
  adjustStock(@Body() body: { productId: number; quantityAfter: number; reason: string; note?: string }, @Req() request: any) {
    return this.inventoryService.adjustStock({ ...body, createdBy: request.user.id });
  }
}
