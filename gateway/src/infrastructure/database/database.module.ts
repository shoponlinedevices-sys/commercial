import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { ProductEntity } from './entities/product.entity';
import { CartEntity, CartLineEntity, OrderEntity } from './entities';
import { NotificationEntity } from './entities/notification.entity';
import { DeliveryAddressEntity } from './entities/delivery-address.entity';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { Cart } from '../../domain/cart/cart.entity';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'mysql',
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 3306),
          username: process.env.DB_USERNAME || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_DATABASE || 'commercial',
          entities: [AccountEntity, ProductEntity, CartEntity, CartLineEntity, OrderEntity, NotificationEntity, DeliveryAddressEntity, PaymentMethodEntity],
          synchronize: false,
          logging: true,
        });
        await dataSource.initialize();
        return dataSource;
      },
    },
    {
      provide: 'DATA_SOURCE',
      useExisting: 'DATABASE_CONNECTION',
    },
  ],
  exports: ['DATABASE_CONNECTION', 'DATA_SOURCE'],
})
export class DatabaseModule {}
