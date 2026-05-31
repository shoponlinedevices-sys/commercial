import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcNotificationsClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['notificationToken', 'notification'],
    protoPath: [
      join(__dirname, '../../_proto/notification-token.proto'),
      join(__dirname, '../../_proto/notification.proto')
    ],
    loader: {
      longs: Number,
      includeDirs: [join(__dirname, '../..', '_proto')],
    },
  },
};
