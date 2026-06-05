import { join } from 'path';

export const grpcNotificationsClientOptions = {
  transport: 1, // Transport.GRPC
  options: {
    package: 'notification',
    protoPath: join(__dirname, '../../../packages/contracts/proto/notification.proto'),
    url: 'localhost:50052',
  },
};
