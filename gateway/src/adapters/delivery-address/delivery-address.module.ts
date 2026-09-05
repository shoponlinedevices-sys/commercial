import { Module } from '@nestjs/common';
import { DeliveryAddressController } from './delivery-address.controller';
import { GrpcClientsModule } from '../../infrastructure/grpc/grpc-clients.module';

@Module({
  imports: [GrpcClientsModule],
  controllers: [DeliveryAddressController],
  providers: [],
})
export class DeliveryAddressModule {}
