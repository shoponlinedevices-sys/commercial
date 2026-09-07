import { Module } from '@nestjs/common';
import { HistoryLogController } from './history-log.controller';
import { HistoryLogService } from './history-log.service';

@Module({
  controllers: [HistoryLogController],
  providers: [HistoryLogService],
})
export class HistoryLogModule {}
