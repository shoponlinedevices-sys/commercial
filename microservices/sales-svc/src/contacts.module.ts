import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONTACTS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: ['contacts'],
          protoPath: join(
            __dirname,
            '../../../packages/contracts/proto/contacts.proto',
          ),
          url: process.env.CONTACTS_SVC_GRPC_URL || 'localhost:50054',
          loader: {
            longs: Number,
            includeDirs: [join(__dirname, '../../../packages/contracts/proto')],
          },
        },
      },
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
