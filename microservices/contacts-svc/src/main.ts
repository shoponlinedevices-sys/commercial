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
      package: 'contacts',
      protoPath: join(
        __dirname,
        '../../../packages/contracts/proto/contacts.proto',
      ),
      url: `0.0.0.0:${process.env.GRPC_PORT || 50054}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3004);
  console.log(`Contacts-svc Service gRPC running on port ${process.env.GRPC_PORT || 3004}`);
}

bootstrap();
