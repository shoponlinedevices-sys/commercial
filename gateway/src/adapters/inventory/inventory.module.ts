import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from '../../application/inventory/inventory.service';
import { InventoryGrpcClient } from '../../infrastructure/grpc/inventory-grpc.client';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, InventoryGrpcClient],
  exports: [InventoryService],
})
export class InventoryModule {}
