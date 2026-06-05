import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationProvider } from './provider/notification-provider';
import { EmailProvider } from './provider/email-provider';
import { grpcNotificationsClientOptions } from './grpc-notifications.options';
import { grpcEmailsClientOptions } from './grpc-emails.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_NOTIFICATIONS_SERVICE',
        ...grpcNotificationsClientOptions,
      },
       {
        name: 'GRPC_EMAILS_SERVICE',
        ...grpcEmailsClientOptions,
      },
    ]),
  ],
  providers: [NotificationProvider, EmailProvider],
  exports: [NotificationProvider, EmailProvider],
})
export class NotificationsModule {}