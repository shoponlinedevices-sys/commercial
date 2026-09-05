import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { AppModule } from './app.module';
import { ProductGrpcController } from './product.grpc.controller';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController, ProductGrpcController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
