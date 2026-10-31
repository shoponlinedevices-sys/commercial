import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from '../../application/inventory/inventory.service';
import { ProductsGrpcClient } from '../../infrastructure/grpc/products-grpc.client';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, ProductsGrpcClient],
  exports: [InventoryService],
})
export class InventoryModule {}
