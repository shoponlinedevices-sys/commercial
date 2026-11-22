import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { ViewEventsAdminGuard } from '../view-events/view-events-admin.guard';
import { SupplierCostsService } from './supplier-costs.service';

@ApiTags('Suppliers and product costs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ViewEventsAdminGuard)
@Controller()
export class SupplierCostsController {
  constructor(private readonly supplierCosts: SupplierCostsService) {}

  @Post('suppliers')
  createSupplier(@Body() body: Record<string, unknown>) {
    return this.supplierCosts.createSupplier(body);
  }

  @Get('suppliers')
  listSuppliers(@Query() query: Record<string, unknown>) {
    return this.supplierCosts.listSuppliers(query);
  }

  @Get('suppliers/:id')
  getSupplier(@Param('id') id: string) {
    return this.supplierCosts.getSupplier(id);
  }

  @Patch('suppliers/:id')
  updateSupplier(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.supplierCosts.updateSupplier(id, body);
  }

  @Patch('suppliers/:id/status')
  updateSupplierStatus(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.supplierCosts.updateSupplierStatus(id, body);
  }

  @Post('product-costs')
  createProductCost(@Body() body: Record<string, unknown>) {
    return this.supplierCosts.createProductCost(body);
  }

  @Get('product-costs/summary')
  getProductCostSummary() {
    return this.supplierCosts.getProductCostSummary();
  }

  @Get('product-costs/product/:productId/latest')
  getLatestProductCost(@Param('productId') productId: string) {
    return this.supplierCosts.getLatestProductCost(productId);
  }

  @Get('product-costs/product/:productId')
  listProductHistory(@Param('productId') productId: string, @Query() query: Record<string, unknown>) {
    return this.supplierCosts.listProductHistory(productId, query);
  }

  @Get('product-costs/:id')
  getProductCost(@Param('id') id: string) {
    return this.supplierCosts.getProductCost(id);
  }

  @Get('product-costs')
  listProductCosts(@Query() query: Record<string, unknown>) {
    return this.supplierCosts.listProductCosts(query);
  }

  @Patch('product-costs/:id')
  updateProductCost(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.supplierCosts.updateProductCost(id, body);
  }
}
