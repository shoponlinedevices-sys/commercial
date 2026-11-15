import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from '../../application/cart/cart.service';
import { GrpcClientsModule } from '../../infrastructure/grpc/grpc-clients.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [GrpcClientsModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
