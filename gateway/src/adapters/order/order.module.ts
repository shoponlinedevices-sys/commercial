import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { OrderController } from './order.controller';
import { OrderService } from '../../application/order/order.service';
import { OrderRepository } from '../../domain/order/order.repository';
import { DatabaseOrderRepository } from '../../infrastructure/database/repositories/database-order.repository';
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
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: DatabaseOrderRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
