import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcProductsClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['product'],
    protoPath: [
      join(__dirname, '../../proto/product.proto')
    ],
    loader: {
      longs: Number,
      includeDirs: [join(__dirname, '../..', 'proto')],
    },
  },
};
