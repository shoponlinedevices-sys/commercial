import { Module } from '@nestjs/common';
import { SupplierCostsController } from './supplier-costs.controller';
import { SupplierCostsService } from './supplier-costs.service';
import { ViewEventsAdminGuard } from '../view-events/view-events-admin.guard';

@Module({
  controllers: [SupplierCostsController],
  providers: [SupplierCostsService, ViewEventsAdminGuard],
})
export class SupplierCostsModule {}
