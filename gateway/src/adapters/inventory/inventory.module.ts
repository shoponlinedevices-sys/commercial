import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from '../../application/inventory/inventory.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
