import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationProvider } from './provider/notification-provider';
import { EmailProvider } from './provider/email-provider';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_NOTIFICATIONS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'notification',
          protoPath: join(__dirname, '../../../packages/contracts/proto/notification.proto'),
          url: 'localhost:50052',
        },
      },
       {
        name: 'GRPC_EMAILS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'email',
          protoPath: join(__dirname, '../../../packages/contracts/proto/email.proto'),
          url: 'localhost:3010',
        },
      },
    ]),
  ],
  providers: [NotificationProvider, EmailProvider],
  exports: [NotificationProvider, EmailProvider],
})
export class NotificationsModule {}