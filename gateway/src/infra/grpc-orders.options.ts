import { join } from 'path';
import { Transport } from '@nestjs/microservices';

export const grpcOrdersClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'orders',
    protoPath: join(__dirname, '../../../packages/contracts/proto/orders.proto'),
    url: 'localhost:50053',
  },
};
