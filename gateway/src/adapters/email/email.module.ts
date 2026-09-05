import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from '../../application/email/email.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { GrpcClientsModule } from '../../infrastructure/grpc/grpc-clients.module';

@Module({
  imports: [DatabaseModule, GrpcClientsModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
