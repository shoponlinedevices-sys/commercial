import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Query,
  Req,
  UseGuards,
  Body,
  ServiceUnavailableException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, Observable } from 'rxjs';
import { Public } from '../../domain/identity/public.decorator';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../domain/identity/optional-jwt-auth.guard';
import { ViewEventsAdminGuard } from './view-events-admin.guard';

interface CmsGrpcService {
  recordViewEvent(request: RecordViewEventRequest): Observable<{ viewEventId: string }>;
  listViewEvents(request: ListViewEventsRequest): Observable<ListViewEventsResponse>;
  getViewEventStats(request: ViewEventStatsRequest): Observable<ViewEventStatsResponse>;
  listViewEventEntityTotals(request: ViewEventEntityTotalsRequest): Observable<ViewEventEntityTotalsResponse>;
}

interface RecordViewEventRequest {
  entityType: string;
  entityId: string;
  visitorId: string;
  sessionId: string;
  userId: string;
  pageUrl: string;
  referrerUrl: string;
}

interface ListViewEventsRequest {
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
}

interface ViewEventStatsRequest {
  entityType: string;
  from: string;
  to: string;
}

interface ViewEventEntityTotalsRequest extends ViewEventStatsRequest {
  page: number;
  limit: number;
}

interface ListViewEventsResponse {
  items: Array<Record<string, string>>;
  total: string;
  page: number;
  limit: number;
}

interface ViewEventStatsResponse {
  totalViews: string;
  uniqueVisitors: string;
  topEntities: Array<Record<string, string>>;
  dailyViews: Array<Record<string, string>>;
}

interface ViewEventEntityTotalsResponse {
  items: Array<Record<string, string>>;
  total: string;
  page: number;
  limit: number;
}

interface HttpRequest {
  user?: { id?: string | number };
}

type QueryParams = Record<string, unknown>;

@ApiTags('View Events')
@Controller('view-events')
export class ViewEventsController implements OnModuleInit {
  private cms!: CmsGrpcService;

  constructor(@Inject('GRPC_CMS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.cms = this.client.getService<CmsGrpcService>('CmsService');
  }

  @Post()
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Record a public category, brand, or product view' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['entityType', 'entityId'],
      properties: {
        entityType: { type: 'string', enum: ['category', 'brand', 'product'] },
        entityId: { type: 'string', example: '123' },
        visitorId: { type: 'string', format: 'uuid' },
        sessionId: { type: 'string', maxLength: 128 },
        pageUrl: { type: 'string', maxLength: 1000 },
        referrerUrl: { type: 'string', maxLength: 1000 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'View event was recorded' })
  @ApiResponse({ status: 400, description: 'Invalid view event' })
  async record(@Body() body: Record<string, unknown>, @Req() request: HttpRequest) {
    if (body && Object.prototype.hasOwnProperty.call(body, 'userId')) {
      throw new BadRequestException('userId is derived from the authenticated session');
    }
    const payload: RecordViewEventRequest = {
      entityType: this.bodyString(body, 'entityType'),
      entityId: this.bodyString(body, 'entityId'),
      visitorId: this.bodyString(body, 'visitorId'),
      sessionId: this.bodyString(body, 'sessionId'),
      userId: request.user?.id == null ? '' : String(request.user.id),
      pageUrl: this.bodyString(body, 'pageUrl'),
      referrerUrl: this.bodyString(body, 'referrerUrl'),
    };
    return this.execute(() => this.cms.recordViewEvent(payload));
  }

  @Get()
  @UseGuards(JwtAuthGuard, ViewEventsAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search view events (administrator authentication required)' })
  @ApiResponse({ status: 200, description: 'Paginated view-event records' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Active administrator role required' })
  @ApiQuery({ name: 'entityType', required: false, enum: ['category', 'brand', 'product'] })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'entitySearch', required: false })
  @ApiQuery({ name: 'from', required: false, description: 'ISO 8601 date/time with timezone' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO 8601 date/time with timezone' })
  @ApiQuery({ name: 'visitorId', required: false })
  @ApiQuery({ name: 'sessionId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async list(@Query() query: QueryParams) {
    const page = this.queryInteger(this.queryString(query.page, 'page'), 1, 'page');
    const limit = this.queryInteger(this.queryString(query.limit, 'limit'), 25, 'limit');
    const payload: ListViewEventsRequest = {
      entityType: this.queryString(query.entityType, 'entityType'),
      entityId: this.queryString(query.entityId, 'entityId'),
      entitySearch: this.queryString(query.entitySearch, 'entitySearch'),
      from: this.queryString(query.from, 'from'),
      to: this.queryString(query.to, 'to'),
      visitorId: this.queryString(query.visitorId, 'visitorId'),
      sessionId: this.queryString(query.sessionId, 'sessionId'),
      userId: this.queryString(query.userId, 'userId'),
      page,
      limit,
    };
    return this.execute(() => this.cms.listViewEvents(payload));
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, ViewEventsAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Summarize view-event analytics (administrator authentication required)' })
  @ApiResponse({ status: 200, description: 'Period totals, unique visitors, top entities, and daily views' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Active administrator role required' })
  @ApiQuery({ name: 'entityType', required: false, enum: ['category', 'brand', 'product'] })
  @ApiQuery({ name: 'from', required: false, description: 'ISO 8601 date/time with timezone' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO 8601 date/time with timezone' })
  async stats(@Query() query: QueryParams) {
    const payload: ViewEventStatsRequest = {
      entityType: this.queryString(query.entityType, 'entityType'),
      from: this.queryString(query.from, 'from'),
      to: this.queryString(query.to, 'to'),
    };
    return this.execute(() => this.cms.getViewEventStats(payload));
  }

  @Get('stats/entities')
  @UseGuards(JwtAuthGuard, ViewEventsAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated view totals for each entity (administrator authentication required)' })
  @ApiResponse({ status: 200, description: 'Paginated aggregated entity totals' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Active administrator role required' })
  @ApiQuery({ name: 'entityType', required: false, enum: ['category', 'brand', 'product'] })
  @ApiQuery({ name: 'from', required: false, description: 'ISO 8601 date/time with timezone' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO 8601 date/time with timezone' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async entityTotals(@Query() query: QueryParams) {
    const payload: ViewEventEntityTotalsRequest = {
      entityType: this.queryString(query.entityType, 'entityType'),
      from: this.queryString(query.from, 'from'),
      to: this.queryString(query.to, 'to'),
      page: this.queryInteger(this.queryString(query.page, 'page'), 1, 'page'),
      limit: this.queryInteger(this.queryString(query.limit, 'limit'), 25, 'limit'),
    };
    return this.execute(() => this.cms.listViewEventEntityTotals(payload));
  }

  private bodyString(body: Record<string, unknown> | undefined, key: string): string {
    const value = body?.[key];
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') {
      throw new BadRequestException(`${key} must be a string`);
    }
    return value;
  }

  private queryInteger(value: string, fallback: number, fieldName: string): number {
    if (!value) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 1000000) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
    return parsed;
  }

  private queryString(value: unknown, fieldName: string): string {
    if (value === undefined) return '';
    if (typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} must be provided once as a string`);
    }
    return value;
  }

  private async execute<T>(call: () => Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(call());
    } catch (error) {
      const code = (error as { code?: number })?.code;
      if (code === 3) {
        throw new BadRequestException('Invalid view-event request');
      }
      if (code === 5) {
        throw new NotFoundException('View-event entity was not found');
      }
      if (code === 7) {
        throw new ForbiddenException();
      }
      if (code === 16) {
        throw new UnauthorizedException();
      }
      if (code === 14) {
        throw new ServiceUnavailableException('CMS service is unavailable');
      }
      if (error instanceof HttpException) throw error;
      if (code !== undefined) {
        throw new BadGatewayException('CMS service request failed');
      }
      throw new HttpException('CMS service request failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
