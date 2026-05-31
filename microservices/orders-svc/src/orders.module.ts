import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './order.entity';
import { OrderLineEntity } from './order-line.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';
import { AppModule } from './app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderLineEntity,
      CartEntity,
      CartLineEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
