import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrdersGatewayService } from './orders-gateway.service';
import { OrdersGatewayController } from './orders-gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: ['orders'],
          protoPath: join(
            __dirname,
            '../../../packages/contracts/proto/orders.proto',
          ),
          url: process.env.ORDERS_SVC_GRPC_URL || 'localhost:50055',
          loader: {
            longs: Number,
            includeDirs: [join(__dirname, '../../../packages/contracts/proto')],
          },
        },
      },
    ]),
  ],
  controllers: [OrdersGatewayController],
  providers: [OrdersGatewayService],
  exports: [OrdersGatewayService],
})
export class OrdersGatewayModule {}
