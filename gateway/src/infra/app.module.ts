import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationProvider } from './provider/notification-provider';
import { grpcNotificationsClientOptions } from './grpc-notifications.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_NOTIFICATIONS_SERVICE',
        ...grpcNotificationsClientOptions,
      },
    ]),
  ],
  providers: [NotificationProvider],
  exports: [NotificationProvider],
})
export class NotificationsModule {}