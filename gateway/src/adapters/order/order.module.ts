import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { OrderController } from './order.controller';
import { OrderService } from '../../application/order/order.service';
import { OrderRepository } from '../../domain/order/order.repository';
import { SalesServiceOrderRepository } from '../../infrastructure/sales-service/sales-service-order.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'notification',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/notification.proto'),
          url: 'localhost:50052',
          options: {
            longs: Number,
          },
        },
      },
      {
        name: 'ORDERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: ['orders'],
          protoPath: join(__dirname, '../../../../packages/contracts/proto/orders.proto'),
          url: 'localhost:50055',
          loader: {
            longs: Number,
            includeDirs: [join(__dirname, '../../../../packages/contracts/proto')],
          },
        },
      },
    ]),
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
