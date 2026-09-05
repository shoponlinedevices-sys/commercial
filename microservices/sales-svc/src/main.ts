import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['orders', 'feature_settings'],
      protoPath: [
        join(__dirname, '../../../packages/contracts/proto/orders.proto'),
        join(__dirname, '../../../packages/contracts/proto/feature-settings.proto'),
      ],
      url: `0.0.0.0:${process.env.GRPC_PORT || 50055}`,
      loader: {
        longs: Number,
        includeDirs: [join(__dirname, '../../../packages/contracts/proto')],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);
  console.log(`Sales-svc Service gRPC running on port ${process.env.GRPC_PORT || 50055}`);
}

bootstrap();
