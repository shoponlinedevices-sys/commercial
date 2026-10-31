import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcInventoryClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['inventory'],
    protoPath: [
      join(__dirname, '../../proto/inventory.proto')
    ],
    loader: {
      longs: Number,
      includeDirs: [join(__dirname, '../..', 'proto')],
    },
  },
};
