import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailEntity } from './email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailEntity])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
