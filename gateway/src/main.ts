import { NestFactory } from '@nestjs/core';
import { AppModule } from './adapters/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // await app.listen(3000);

   await app.listen(3000, '0.0.0.0');

  console.log('Backend running on port 3000');
}
bootstrap();
