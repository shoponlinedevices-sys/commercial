import { Module } from '@nestjs/common';
import { DeliveryAddressController } from './delivery-address.controller';
import { DeliveryAddressService } from '../../application/delivery-address/delivery-address.service';
import { DeliveryAddressRepository } from '../../infrastructure/database/repositories/delivery-address.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DeliveryAddressController],
  providers: [DeliveryAddressService, DeliveryAddressRepository],
  exports: [DeliveryAddressService],
})
export class DeliveryAddressModule {}
