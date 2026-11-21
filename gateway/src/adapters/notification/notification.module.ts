import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../../application/notification/notification.service';
import { GrpcClientsModule } from '../../infrastructure/grpc/grpc-clients.module';

@Module({
  imports: [GrpcClientsModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
