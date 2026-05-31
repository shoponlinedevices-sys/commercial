import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UserProfileEntity } from './user-profile.entity';
import { DeliveryAddressEntity } from './delivery-address.entity';
import { PaymentMethodEntity } from './payment-method.entity';
import { AppModule } from './app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([
      UserProfileEntity,
      DeliveryAddressEntity,
      PaymentMethodEntity,
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
