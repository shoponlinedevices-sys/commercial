import { join } from 'path';
import { Transport } from '@nestjs/microservices';

export const grpcNotificationsClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'notification',
    protoPath: join(__dirname, '../../../packages/contracts/proto/notification.proto'),
    url: 'localhost:50052',
  },
};
