import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderLineEntity } from './order-line.entity';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrdersEmailProvider } from './orders-email.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderLineEntity, CartEntity, CartLineEntity]),
    ClientsModule.register([
      {
        name: 'GRPC_EMAILS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'email',
          protoPath: join(__dirname, '../../../packages/contracts/proto/email.proto'),
          url: process.env.EMAIL_GRPC_URL || 'localhost:50056',
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrdersEmailProvider,
    {
      provide: 'DATA_SOURCE',
      useFactory: (dataSource: DataSource) => dataSource,
      inject: [DataSource],
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
