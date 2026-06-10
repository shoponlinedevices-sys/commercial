import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { AdsModule } from './ads/ads.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { DeliveryAddressModule } from './delivery-address/delivery-address.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { EmailModule } from './email/email.module';
import { FeatureSettingsModule } from './feature-settings/feature-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CartModule, ProductModule, AuthModule, AdsModule, OrderModule, NotificationModule, UserProfileModule, DeliveryAddressModule, PaymentMethodModule, EmailModule, FeatureSettingsModule
  ],
})
export class AppModule {}
