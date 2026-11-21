import { Module } from '@nestjs/common';
import { ViewEventsController } from './view-events.controller';
import { ViewEventsAdminGuard } from './view-events-admin.guard';

@Module({
  controllers: [ViewEventsController],
  providers: [ViewEventsAdminGuard],
})
export class ViewEventsModule {}
