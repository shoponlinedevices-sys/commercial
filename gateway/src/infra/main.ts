import { NestFactory, Reflector } from '@nestjs/core';
import {
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';

import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

import { NotificationsModule } from './app.module';

import { grpcNotificationsClientOptions } from './grpc-notifications.options';
import { JwtAuthGuard } from '../domain/identity/jwt-auth.guard';


async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  // body parser
  app.use(bodyParser.json({ limit: '1000mb' }));

  app.use(
    bodyParser.urlencoded({
      limit: '1000mb',
      extended: true,
    }),
  );

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // auth guard
  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
  );

  // ports
  const hostGrpcPort =
    process.env.HOST_GRPC_PORT ?? '50051';

  const hostHttpPort =
    process.env.HOST_HTTP_PORT ?? '10051';

  // grpc options
  const grpcOptions =
    grpcNotificationsClientOptions.options as any;

  const hostGrpcOption: GrpcOptions = {
    transport: Transport.GRPC,

    options: {
      ...grpcOptions,

      // grpc server bind
      url: `0.0.0.0:${hostGrpcPort}`,
    },
  };

  // connect grpc microservice
  app.connectMicroservice<GrpcOptions>(
    hostGrpcOption,
  );

  // start microservices
  await app.startAllMicroservices();

  // cors
  app.enableCors();

  // http server
  await app.listen(hostHttpPort);

  console.log(
    `HTTP running on : ${hostHttpPort}`,
  );

  console.log(
    `gRPC running on : ${hostGrpcPort}`,
  );
}

bootstrap();