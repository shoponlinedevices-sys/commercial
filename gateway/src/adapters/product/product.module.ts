import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from '../../application/product/product.service';
import { DatabaseProductRepository } from '../../infrastructure/database/repositories/database-product.repository';
import { ProductRepository } from '../../domain/product/product.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: DatabaseProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
