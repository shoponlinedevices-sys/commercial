import { join } from 'path';

export const grpcEmailsClientOptions = {
  transport: 1, // Transport.GRPC
  options: {
    package: 'email',
    protoPath: join(__dirname, '../../../packages/contracts/proto/email.proto'),
    url: 'localhost:3010',
  },
};
