import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderLineEntity } from './order-line.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderLineEntity]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'DATA_SOURCE',
      useFactory: (dataSource: DataSource) => dataSource,
      inject: [DataSource],
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
