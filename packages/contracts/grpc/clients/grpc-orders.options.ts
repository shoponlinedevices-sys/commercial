import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcOrdersClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['orders'],
    protoPath: [
      join(__dirname, '../../proto/orders.proto')
    ],
    loader: {
      longs: Number,
      includeDirs: [join(__dirname, '../..', 'proto')],
    },
  },
};
