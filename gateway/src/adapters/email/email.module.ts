import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from '../../application/email/email.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
