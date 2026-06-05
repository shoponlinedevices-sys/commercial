import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from '../../application/email/email.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { NotificationsModule } from '../../infra/app.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
