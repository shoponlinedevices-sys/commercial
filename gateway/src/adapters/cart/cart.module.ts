import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartRepository } from '../../domain/cart/cart.repository';
import { CartService } from '../../application/cart/cart.service';
import { SalesServiceCartRepository } from '../../infrastructure/sales-service/sales-service-cart.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CartRepository,
      useClass: SalesServiceCartRepository,
    },
  ],
})
export class CartModule {}
