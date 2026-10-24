import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { InventoryController } from './inventory.controller';
import { ProductEntity } from './product.entity';
import { InventoryEntity } from './inventory.entity';
import { InventoryTransactionEntity } from './inventory-transaction.entity';
import { AppModule } from './app.module';
import { ProductGrpcController } from './product.grpc.controller';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([ProductEntity, InventoryEntity, InventoryTransactionEntity]),
  ],
  controllers: [ProductController, InventoryController, ProductGrpcController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
