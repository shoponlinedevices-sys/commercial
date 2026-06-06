import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcEmailsClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'email',
    protoPath: join(__dirname, '../../proto/email.proto'),
    loader: {
      longs: Number,
      includeDirs: [join(__dirname, '../..', 'proto')],
    },
  },
};
