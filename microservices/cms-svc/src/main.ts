import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'cms',
      protoPath: join(process.cwd(), '..', '..', 'packages', 'contracts', 'proto', 'cms.proto'),
      url: `0.0.0.0:${process.env.GRPC_PORT || 50057}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(Number(process.env.PORT || 3007), '0.0.0.0');
  console.log(`CMS service HTTP health endpoint listening on port ${process.env.PORT || 3007}`);
}

void bootstrap();
