import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from '../../application/product/product.service';
import { ProductsRepository } from '../../infrastructure/product/product.repository';
import { ProductRepository } from '../../domain/product/product.repository';
import { ProductGrpcClient } from '../../infrastructure/grpc/product-grpc.client';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductsRepository,
    },
    ProductGrpcClient
  ],
  exports: [ProductService],
})
export class ProductModule {}
