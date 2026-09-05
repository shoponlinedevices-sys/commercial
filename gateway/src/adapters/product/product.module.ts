import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from '../../application/product/product.service';
import { ProductsServiceProductRepository } from '../../infrastructure/products-service/products-service-product.repository';
import { ProductRepository } from '../../domain/product/product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductsServiceProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
