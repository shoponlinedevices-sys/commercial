import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from '../../application/order/order.service';
import { OrderRepository } from '../../domain/order/order.repository';
import { SalesServiceOrderRepository } from '../../infrastructure/sales-service/sales-service-order.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: SalesServiceOrderRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
