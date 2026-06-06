import { join } from 'path';
import { Transport } from '@nestjs/microservices';

export const grpcEmailsClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'email',
    protoPath: join(__dirname, '../../../packages/contracts/proto/email.proto'),
    url: 'localhost:3010',
  },
};
