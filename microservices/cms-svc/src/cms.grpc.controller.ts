import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CmsService } from './cms.service';

@Controller()
export class CmsGrpcController {
  constructor(private readonly cmsService: CmsService) {}

  @GrpcMethod('CmsService', 'RecordViewEvent')
  recordViewEvent(request: {
    entityType: string;
    entityId: string;
    visitorId: string;
    sessionId: string;
    userId: string;
    pageUrl: string;
    referrerUrl: string;
  }) {
    return this.cmsService.recordViewEvent(request);
  }

  @GrpcMethod('CmsService', 'ListViewEvents')
  listViewEvents(request: {
    entityType: string;
    entityId: string;
    entitySearch: string;
    from: string;
    to: string;
    visitorId: string;
    sessionId: string;
    userId: string;
    page: number;
    limit: number;
  }) {
    return this.cmsService.listViewEvents(request);
  }

  @GrpcMethod('CmsService', 'GetViewEventStats')
  getViewEventStats(request: { entityType: string; from: string; to: string }) {
    return this.cmsService.getViewEventStats(request);
  }

  @GrpcMethod('CmsService', 'ListViewEventEntityTotals')
  listViewEventEntityTotals(request: {
    entityType: string;
    from: string;
    to: string;
    page: number;
    limit: number;
  }) {
    return this.cmsService.listViewEventEntityTotals(request);
  }
}
