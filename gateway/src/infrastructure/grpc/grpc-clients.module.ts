import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailProvider } from './providers/email.provider';
import { NotificationProvider } from './providers/notification.provider';
import { ContactsGrpcClient } from './contacts-grpc.client';
import { contractsProtoPath } from './grpc-path';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_NOTIFICATIONS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'notification',
          protoPath: contractsProtoPath('notification.proto'),
          url: process.env.NOTIFICATION_GRPC_URL || 'localhost:50051',
        },
      },
      {
        name: 'GRPC_EMAILS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'email',
          protoPath: contractsProtoPath('email.proto'),
          url: process.env.EMAIL_GRPC_URL || 'localhost:50056',
        },
      },
      {
        name: 'GRPC_PRODUCTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: contractsProtoPath('product.proto'),
          url: process.env.PRODUCTS_GRPC_URL || 'localhost:50053',
        },
      },
      {
        name: 'GRPC_CONTACTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'contacts',
          protoPath: contractsProtoPath('contacts.proto'),
          url: process.env.CONTACTS_GRPC_URL || 'localhost:50054',
        },
      },
      {
        name: 'GRPC_AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: contractsProtoPath('auth.proto'),
          url: process.env.CONTACTS_GRPC_URL || 'localhost:50054',
          loader: { keepCase: true },
        },
      },
      {
        name: 'GRPC_ORDERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'orders',
          protoPath: contractsProtoPath('orders.proto'),
          url: process.env.SALES_GRPC_URL || 'localhost:50055',
        },
      },
      {
        name: 'GRPC_FEATURE_SETTINGS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'feature_settings',
          protoPath: contractsProtoPath('feature-settings.proto'),
          url: process.env.SALES_GRPC_URL || 'localhost:50055',
        },
      },
    ]),
  ],
  providers: [ContactsGrpcClient, NotificationProvider, EmailProvider],
  exports: [ClientsModule, ContactsGrpcClient, NotificationProvider, EmailProvider],
})
export class GrpcClientsModule {}
