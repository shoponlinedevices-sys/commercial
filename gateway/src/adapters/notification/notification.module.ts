import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../../application/notification/notification.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
