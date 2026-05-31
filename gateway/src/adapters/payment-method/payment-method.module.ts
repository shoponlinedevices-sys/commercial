import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from '../../application/payment-method/payment-method.service';
import { PaymentMethodRepository } from '../../infrastructure/database/repositories/payment-method.repository';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PaymentMethodRepository, AccountRepository],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
