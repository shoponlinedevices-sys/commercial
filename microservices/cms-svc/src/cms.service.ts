import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { DataSource } from 'typeorm';
import {
  RecordViewEventInput,
  ViewEventFilters,
  ViewEntityType,
  validateRecordViewEvent,
  validatePositiveInteger,
  validateStatsFilters,
  validateViewEventFilters,
} from './view-event.validation';

interface ViewEventRow {
  viewEventId: string;
  entityType: ViewEntityType;
  entityId: string;
  entityName: string;
  visitorId: string | null;
  sessionId: string | null;
  userId: string | null;
  pageUrl: string | null;
  referrerUrl: string | null;
  viewedAt: Date | string;
}

interface EntityTotalRow {
  entityType: ViewEntityType;
  entityId: string | number;
  entityName: string;
  views: string | number;
  uniqueVisitors: string | number;
}

interface InsertResult {
  insertId: string | number;
}

const ENTITY_EXISTS_SQL: Record<ViewEntityType, string> = {
  category: 'SELECT 1 FROM tbl_category WHERE id = ? LIMIT 1',
  brand: 'SELECT 1 FROM tbl_brands WHERE brand_id = ? AND deleted_at IS NULL LIMIT 1',
  product: 'SELECT 1 FROM tbl_product WHERE id = ? LIMIT 1',
};

const CATALOG_JOINS = `
  LEFT JOIN tbl_product p ON e.entity_type = 'product' AND p.id = e.entity_id
  LEFT JOIN tbl_category c ON e.entity_type = 'category' AND c.id = e.entity_id
  LEFT JOIN tbl_brands b ON e.entity_type = 'brand' AND b.brand_id = e.entity_id
`;
const ENTITY_NAME = "COALESCE(p.name, c.name, b.name, CONCAT(e.entity_type, ' #', e.entity_id))";

@Injectable()
export class CmsService {
  constructor(private readonly dataSource: DataSource) {}

  async recordViewEvent(input: Parameters<typeof validateRecordViewEvent>[0]) {
    const event: RecordViewEventInput = validateRecordViewEvent(input);
    const existing = await this.dataSource.query(
      ENTITY_EXISTS_SQL[event.entityType],
      [event.entityId],
    );
    if (!existing.length) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'Entity was not found' });
    }

    const result: InsertResult = await this.dataSource.query(
      `INSERT INTO tbl_view_events
        (entity_type, entity_id, visitor_id, session_id, user_id, page_url, referrer_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.entityType,
        event.entityId,
        event.visitorId ?? null,
        event.sessionId ?? null,
        event.userId ?? null,
        event.pageUrl ?? null,
        event.referrerUrl ?? null,
      ],
    );
    return { viewEventId: String(result.insertId) };
  }

  async listViewEvents(input: {
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
    const filters: ViewEventFilters = validateViewEventFilters(input);
    const { where, parameters } = this.where(filters);
    const [countRows, rows]: [Array<{ total: string | number }>, ViewEventRow[]] = await Promise.all([
      this.dataSource.query(
        `SELECT COUNT(*) AS total FROM tbl_view_events e ${CATALOG_JOINS} ${where}`,
        parameters,
      ),
      this.dataSource.query(
        `SELECT
           e.view_event_id AS viewEventId,
           e.entity_type AS entityType,
           e.entity_id AS entityId,
           ${ENTITY_NAME} AS entityName,
           e.visitor_id AS visitorId,
           e.session_id AS sessionId,
           e.user_id AS userId,
           e.page_url AS pageUrl,
           e.referrer_url AS referrerUrl,
           DATE_FORMAT(
             CONVERT_TZ(e.viewed_at, @@session.time_zone, '+00:00'),
             '%Y-%m-%dT%H:%i:%s.000Z'
           ) AS viewedAt
         FROM tbl_view_events e
         ${CATALOG_JOINS}
         ${where}
         ORDER BY e.viewed_at DESC, e.view_event_id DESC
         LIMIT ? OFFSET ?`,
        [...parameters, filters.limit, (filters.page - 1) * filters.limit],
      ),
    ]);

    return {
      items: rows.map((row) => ({
        viewEventId: String(row.viewEventId),
        entityType: row.entityType,
        entityId: String(row.entityId),
        entityName: row.entityName,
        visitorId: row.visitorId ?? '',
        sessionId: row.sessionId ?? '',
        userId: row.userId ?? '',
        pageUrl: row.pageUrl ?? '',
        referrerUrl: row.referrerUrl ?? '',
        viewedAt: this.toIsoDate(row.viewedAt),
      })),
      total: String(countRows[0]?.total ?? '0'),
      page: filters.page,
      limit: filters.limit,
    };
  }

  async getViewEventStats(input: { entityType: string; from: string; to: string }) {
    const filters = validateStatsFilters(input);
    const { where, parameters } = this.where(filters);
    const totals = await this.dataSource.query(
      `SELECT COUNT(*) AS totalViews, COUNT(DISTINCT e.visitor_id) AS uniqueVisitors
       FROM tbl_view_events e ${where}`,
      parameters,
    );
    const dailyViews: Array<{ date: string; views: string | number }> = await this.dataSource.query(
      `SELECT DATE_FORMAT(MIN(e.viewed_at), '%Y-%m-%d') AS date, COUNT(*) AS views
       FROM tbl_view_events e ${where}
       GROUP BY DATE(e.viewed_at)
       ORDER BY DATE(e.viewed_at) ASC`,
      parameters,
    );
    const types = filters.entityType
      ? [filters.entityType]
      : (['product', 'brand', 'category'] as const);
    const topEntityRows: EntityTotalRow[][] = await Promise.all(types.map((entityType) =>
      this.dataSource.query(
        `SELECT
           e.entity_type AS entityType,
           e.entity_id AS entityId,
           ${ENTITY_NAME} AS entityName,
           COUNT(*) AS views,
           COUNT(DISTINCT e.visitor_id) AS uniqueVisitors
         FROM tbl_view_events e
         ${CATALOG_JOINS}
         ${where}${where ? ' AND' : ' WHERE'} e.entity_type = ?
         GROUP BY e.entity_type, e.entity_id, p.name, c.name, b.name
         ORDER BY views DESC, e.entity_id ASC
         LIMIT 10`,
        [...parameters, entityType],
      ),
    ));
    const topEntities = topEntityRows.flat().map((row) => ({
      entityType: row.entityType,
      entityId: String(row.entityId),
      entityName: row.entityName,
      views: String(row.views),
      uniqueVisitors: String(row.uniqueVisitors),
    }));

    return {
      totalViews: String(totals[0]?.totalViews ?? '0'),
      uniqueVisitors: String(totals[0]?.uniqueVisitors ?? '0'),
      topEntities,
      dailyViews: dailyViews.map((row) => ({
        date: String(row.date),
        views: String(row.views),
      })),
    };
  }

  async listViewEventEntityTotals(input: {
    entityType: string;
    from: string;
    to: string;
    page: number;
    limit: number;
  }) {
    const filters = validateStatsFilters(input);
    const page = validatePositiveInteger(input.page || 1, 'page', 1000000);
    const limit = validatePositiveInteger(input.limit || 25, 'limit', 100);
    const { where, parameters } = this.where(filters);
    const [countRows, rows]: [Array<{ total: string | number }>, EntityTotalRow[]] = await Promise.all([
      this.dataSource.query(
        `SELECT COUNT(*) AS total
         FROM (
           SELECT e.entity_type, e.entity_id
           FROM tbl_view_events e ${where}
           GROUP BY e.entity_type, e.entity_id
         ) AS grouped_entities`,
        parameters,
      ),
      this.dataSource.query(
        `SELECT
           e.entity_type AS entityType,
           e.entity_id AS entityId,
           ${ENTITY_NAME} AS entityName,
           COUNT(*) AS views,
           COUNT(DISTINCT e.visitor_id) AS uniqueVisitors
         FROM tbl_view_events e
         ${CATALOG_JOINS}
         ${where}
         GROUP BY e.entity_type, e.entity_id, p.name, c.name, b.name
         ORDER BY views DESC, e.entity_type ASC, e.entity_id ASC
         LIMIT ? OFFSET ?`,
        [...parameters, limit, (page - 1) * limit],
      ),
    ]);

    return {
      items: rows.map((row) => ({
        entityType: row.entityType,
        entityId: String(row.entityId),
        entityName: row.entityName,
        views: String(row.views),
        uniqueVisitors: String(row.uniqueVisitors),
      })),
      total: String(countRows[0]?.total ?? '0'),
      page,
      limit,
    };
  }

  private where(filters: Partial<ViewEventFilters>) {
    const clauses: string[] = [];
    const parameters: Array<string | number> = [];
    if (filters.entityType) {
      clauses.push('e.entity_type = ?');
      parameters.push(filters.entityType);
    }
    if (filters.entityId) {
      clauses.push('e.entity_id = ?');
      parameters.push(filters.entityId);
    }
    if (filters.visitorId) {
      clauses.push('e.visitor_id = ?');
      parameters.push(filters.visitorId);
    }
    if (filters.sessionId) {
      clauses.push('e.session_id = ?');
      parameters.push(filters.sessionId);
    }
    if (filters.userId) {
      clauses.push('e.user_id = ?');
      parameters.push(filters.userId);
    }
    if (filters.from) {
      clauses.push("e.viewed_at >= CONVERT_TZ(?, '+00:00', @@session.time_zone)");
      parameters.push(filters.from);
    }
    if (filters.to) {
      clauses.push("e.viewed_at <= CONVERT_TZ(?, '+00:00', @@session.time_zone)");
      parameters.push(filters.to);
    }
    if (filters.entitySearch) {
      const search = filters.entitySearch.replace(/[!%_]/g, '!$&');
      clauses.push(`${ENTITY_NAME} LIKE ? ESCAPE '!'`);
      parameters.push(`%${search}%`);
    }
    return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', parameters };
  }

  private toIsoDate(value: Date | string): string {
    if (typeof value === 'string' && value.endsWith('Z')) return value;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Database returned an invalid view timestamp');
    }
    return date.toISOString();
  }
}
