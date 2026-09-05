import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EmailProvider } from './providers/email.provider';
import { NotificationProvider } from './providers/notification.provider';
import { ContactsGrpcClient } from './contacts-grpc.client';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_NOTIFICATIONS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'notification',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/notification.proto'),
          url: process.env.NOTIFICATION_GRPC_URL || 'localhost:50051',
        },
      },
      {
        name: 'GRPC_EMAILS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'email',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/email.proto'),
          url: process.env.EMAIL_GRPC_URL || 'localhost:50056',
        },
      },
      {
        name: 'GRPC_PRODUCTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/product.proto'),
          url: process.env.PRODUCTS_GRPC_URL || 'localhost:50053',
        },
      },
      {
        name: 'GRPC_CONTACTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'contacts',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/contacts.proto'),
          url: process.env.CONTACTS_GRPC_URL || 'localhost:50054',
        },
      },
      {
        name: 'GRPC_AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/auth.proto'),
          url: process.env.CONTACTS_GRPC_URL || 'localhost:50054',
          loader: { keepCase: true },
        },
      },
      {
        name: 'GRPC_ORDERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'orders',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/orders.proto'),
          url: process.env.SALES_GRPC_URL || 'localhost:50055',
        },
      },
      {
        name: 'GRPC_FEATURE_SETTINGS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'feature_settings',
          protoPath: join(__dirname, '../../../../packages/contracts/proto/feature-settings.proto'),
          url: process.env.SALES_GRPC_URL || 'localhost:50055',
        },
      },
    ]),
  ],
  providers: [ContactsGrpcClient, NotificationProvider, EmailProvider],
  exports: [ContactsGrpcClient, NotificationProvider, EmailProvider],
})
export class GrpcClientsModule {}
