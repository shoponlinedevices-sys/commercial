import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: ['product'],
          protoPath: join(
            __dirname,
            '../../../packages/contracts/proto/product.proto',
          ),
          url: process.env.PRODUCTS_SVC_GRPC_URL || 'localhost:50053',
          loader: {
            longs: Number,
            includeDirs: [join(__dirname, '../../../packages/contracts/proto')],
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
