import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcContactsClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['contacts'],
    protoPath: [
      join(__dirname, '../../proto/contacts.proto')
    ],
    loader: {
      longs: Number,
      includeDirs: [join(__dirname, '../..', 'proto')],
    },
  },
};
