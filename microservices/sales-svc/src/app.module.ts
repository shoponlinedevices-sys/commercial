import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import databaseConfig from './config/database.config';
import { OrderModule } from './order.module';
import { FeatureSettingsModule } from './feature-settings.module';
import { ProductModule } from './product.module';
import { ContactsModule } from './contacts.module';
import { OrdersGatewayModule } from './orders-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return configService.get<TypeOrmModuleOptions>('database')!;
      },
    }),

    OrderModule,
    FeatureSettingsModule,
    ProductModule,
    ContactsModule,
    OrdersGatewayModule,
  ],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (dataSource: DataSource) => dataSource,
      inject: [DataSource],
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class AppModule {}
