import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { HistoryLogService } from './history-log.service';

@Controller('history-logs')
export class HistoryLogController {
  constructor(private readonly historyLogService: HistoryLogService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    return this.historyLogService.findAll(Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 500) : 200);
  }
}
