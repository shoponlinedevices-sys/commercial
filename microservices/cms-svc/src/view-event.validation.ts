import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export const viewEntityTypes = ['category', 'brand', 'product'] as const;
export type ViewEntityType = (typeof viewEntityTypes)[number];

const MAX_UNSIGNED_BIGINT = 18446744073709551615n;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMEZONE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export interface RecordViewEventInput {
  entityType: ViewEntityType;
  entityId: string;
  visitorId?: string;
  sessionId?: string;
  userId?: string;
  pageUrl?: string;
  referrerUrl?: string;
}

export interface ViewEventFilters {
  entityType?: ViewEntityType;
  entityId?: string;
  entitySearch?: string;
  from?: string;
  to?: string;
  visitorId?: string;
  sessionId?: string;
  userId?: string;
  page: number;
  limit: number;
}

export function isViewEntityType(value: string): value is ViewEntityType {
  return viewEntityTypes.includes(value as ViewEntityType);
}

export function validateUnsignedId(value: string, fieldName: string): string {
  if (!/^[1-9]\d{0,19}$/.test(value) || BigInt(value) > MAX_UNSIGNED_BIGINT) {
    throw invalid(`${fieldName} must be a positive unsigned 64-bit integer`);
  }
  return value;
}

function validateOptionalString(value: string, fieldName: string, maxLength: number): string | undefined {
  if (!value) return undefined;
  if (value.length > maxLength || /[\u0000-\u001f\u007f]/.test(value)) {
    throw invalid(`${fieldName} is invalid`);
  }
  return value;
}

function validateOptionalUrl(value: string, fieldName: string): string | undefined {
  const url = validateOptionalString(value, fieldName, 1000);
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
      throw new Error();
    }
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    throw invalid(`${fieldName} must be an HTTP or HTTPS URL`);
  }
}

export function validateRecordViewEvent(input: {
  entityType: string;
  entityId: string;
  visitorId: string;
  sessionId: string;
  userId: string;
  pageUrl: string;
  referrerUrl: string;
}): RecordViewEventInput {
  if (!isViewEntityType(input.entityType)) {
    throw invalid('entityType must be category, brand, or product');
  }

  const visitorId = validateOptionalString(input.visitorId, 'visitorId', 36);
  if (visitorId && !UUID_PATTERN.test(visitorId)) {
    throw invalid('visitorId must be a UUID');
  }

  const sessionId = validateOptionalString(input.sessionId, 'sessionId', 128);
  const userId = input.userId ? validateUnsignedId(input.userId, 'userId') : undefined;

  return {
    entityType: input.entityType,
    entityId: validateUnsignedId(input.entityId, 'entityId'),
    visitorId,
    sessionId,
    userId,
    pageUrl: validateOptionalUrl(input.pageUrl, 'pageUrl'),
    referrerUrl: validateOptionalUrl(input.referrerUrl, 'referrerUrl'),
  };
}

function validateDate(value: string, fieldName: string): string | undefined {
  if (!value) return undefined;
  if (!TIMEZONE_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw invalid(`${fieldName} must be an ISO 8601 date with a timezone`);
  }
  return new Date(value).toISOString().slice(0, 19).replace('T', ' ');
}

export function validateViewEventFilters(input: {
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
}): ViewEventFilters {
  const entityType = input.entityType
    ? isViewEntityType(input.entityType)
      ? input.entityType
      : invalid('entityType must be category, brand, or product')
    : undefined;
  const from = validateDate(input.from, 'from');
  const to = validateDate(input.to, 'to');

  if (from && to && from > to) {
    throw invalid('from must be earlier than or equal to to');
  }

  const visitorId = validateOptionalString(input.visitorId, 'visitorId', 36);
  if (visitorId && !UUID_PATTERN.test(visitorId)) {
    throw invalid('visitorId must be a UUID');
  }

  return {
    entityType,
    entityId: input.entityId ? validateUnsignedId(input.entityId, 'entityId') : undefined,
    entitySearch: validateOptionalString((input.entitySearch || '').trim(), 'entitySearch', 150),
    from,
    to,
    visitorId,
    sessionId: validateOptionalString(input.sessionId, 'sessionId', 128),
    userId: input.userId ? validateUnsignedId(input.userId, 'userId') : undefined,
    page: validatePositiveInteger(input.page || 1, 'page', 1000000),
    limit: validatePositiveInteger(input.limit || 25, 'limit', 100),
  };
}

export function validateStatsFilters(input: {
  entityType: string;
  from: string;
  to: string;
}): { entityType?: ViewEntityType; from?: string; to?: string } {
  const entityType = input.entityType
    ? isViewEntityType(input.entityType)
      ? input.entityType
      : invalid('entityType must be category, brand, or product')
    : undefined;
  const from = validateDate(input.from, 'from');
  const to = validateDate(input.to, 'to');

  if (from && to && from > to) {
    throw invalid('from must be earlier than or equal to to');
  }
  return { entityType, from, to };
}

export function validatePositiveInteger(value: number, fieldName: string, max: number): number {
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw invalid(`${fieldName} must be an integer between 1 and ${max}`);
  }
  return value;
}

function invalid(message: string): never {
  throw new RpcException({ code: status.INVALID_ARGUMENT, message });
}
