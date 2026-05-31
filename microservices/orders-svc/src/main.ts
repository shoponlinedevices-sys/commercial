import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Connect gRPC microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'orders',
      protoPath: join(
        __dirname,
        '../../../packages/contracts/proto/orders.proto',
      ),
      url: `0.0.0.0:${process.env.GRPC_PORT || 50055}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3005);
}

bootstrap();
