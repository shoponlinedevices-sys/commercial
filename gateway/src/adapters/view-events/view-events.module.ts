import { Module } from '@nestjs/common';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ViewEventsController } from './view-events.controller';
import { ViewEventsAdminGuard } from './view-events-admin.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [ViewEventsController],
  providers: [AccountRepository, ViewEventsAdminGuard],
})
export class ViewEventsModule {}
