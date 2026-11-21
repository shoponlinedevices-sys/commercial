import { Module } from '@nestjs/common';
import { HistoryLogController } from './history-log.controller';
import { HistoryLogService } from './history-log.service';
import { GrpcClientsModule } from '../../infrastructure/grpc/grpc-clients.module';

@Module({
  imports: [GrpcClientsModule],
  controllers: [HistoryLogController],
  providers: [HistoryLogService],
})
export class HistoryLogModule {}
