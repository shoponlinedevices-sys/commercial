import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { CartRepository } from '../../domain/cart/cart.repository';
import { CartService } from '../../application/cart/cart.service';
import { DatabaseCartRepository } from '../../infrastructure/database/repositories/database-cart.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CartRepository,
      useClass: DatabaseCartRepository,
    },
  ],
})
export class CartModule {}
