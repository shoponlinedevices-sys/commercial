import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { DataSource } from 'typeorm';
import { CmsService } from './cms.service';

type QueryCall = { sql: string; parameters: unknown[] };
type QueryHandler = (sql: string, parameters: unknown[]) => Promise<unknown>;

function createCmsService(handler: QueryHandler, calls: QueryCall[] = []) {
  const dataSource = Object.assign(Object.create(DataSource.prototype), {
    query: async (sql: string, parameters: unknown[] = []) => {
      calls.push({ sql, parameters });
      return handler(sql, parameters);
    },
  }) as DataSource;
  return new CmsService(dataSource);
}

test('records an existing entity using parameterized values', async () => {
  const calls: QueryCall[] = [];
  const service = createCmsService(async (sql) => {
    if (sql.startsWith('SELECT 1')) return [{ 1: 1 }];
    return { insertId: 21 };
  }, calls);

  const result = await service.recordViewEvent({
    entityType: 'product',
    entityId: '9',
    visitorId: '8c8419ad-7a80-42a9-a87f-8bbdf0a415fd',
    sessionId: 'a1e98d8a-8a8c-4c2c-95d0-51e4419d9790',
    userId: '17',
    pageUrl: 'https://shop.example/products/9?campaign=private',
    referrerUrl: '',
  });

  assert.deepEqual(result, { viewEventId: '21' });
  assert.match(calls[1].sql, /INSERT INTO tbl_view_events/);
  assert.deepEqual(calls[1].parameters, [
    'product',
    '9',
    '8c8419ad-7a80-42a9-a87f-8bbdf0a415fd',
    'a1e98d8a-8a8c-4c2c-95d0-51e4419d9790',
    '17',
    'https://shop.example/products/9',
    null,
  ]);
});

test('applies scoped filters, newest-first ordering, and pagination', async () => {
  const calls: QueryCall[] = [];
  const service = createCmsService(async (sql) => {
    if (sql.includes('COUNT(*) AS total')) return [{ total: '51' }];
    if (sql.includes('ORDER BY e.viewed_at DESC')) {
      return [{
        viewEventId: '11',
        entityType: 'product',
        entityId: '9',
        entityName: 'Drill',
        visitorId: '',
        sessionId: '',
        userId: '',
        pageUrl: '',
        referrerUrl: '',
        viewedAt: '2026-10-17T00:00:00.000Z',
      }];
    }
    return [];
  }, calls);

  const result = await service.listViewEvents({
    entityType: 'product',
    entityId: '9',
    entitySearch: 'drill',
    from: '2026-10-01T00:00:00.000Z',
    to: '',
    visitorId: '',
    sessionId: '',
    userId: '',
    page: 2,
    limit: 10,
  });

  const listQuery = calls.find((call) => call.sql.includes('ORDER BY e.viewed_at DESC'));
  assert.ok(listQuery);
  assert.match(listQuery.sql, /e\.entity_type = \?/);
  assert.match(listQuery.sql, /e\.entity_id = \?/);
  assert.match(listQuery.sql, /e\.viewed_at >= CONVERT_TZ/);
  assert.match(listQuery.sql, /ORDER BY e\.viewed_at DESC, e\.view_event_id DESC/);
  assert.deepEqual(listQuery.parameters.slice(-2), [10, 10]);
  assert.equal(result.page, 2);
  assert.equal(result.total, '51');
  assert.equal(result.items[0].entityType, 'product');
});

test('does not turn database failures into successful event writes', async () => {
  const service = createCmsService(async () => {
    throw new Error('database unavailable');
  });

  await assert.rejects(
    service.recordViewEvent({
      entityType: 'brand',
      entityId: '3',
      visitorId: '',
      sessionId: '',
      userId: '',
      pageUrl: '',
      referrerUrl: '',
    }),
    /database unavailable/,
  );
});

test('calculates totals, unique visitors, and daily groups within the requested scope', async () => {
  const calls: QueryCall[] = [];
  const service = createCmsService(async (sql) => {
    if (sql.includes('COUNT(DISTINCT e.visitor_id) AS uniqueVisitors') && sql.includes('FROM tbl_view_events e WHERE')) {
      return [{ totalViews: '8', uniqueVisitors: '3' }];
    }
    if (sql.includes('GROUP BY DATE(e.viewed_at)')) {
      return [{ date: '2026-10-17', views: '8' }];
    }
    if (sql.includes('LIMIT 10')) {
      return [{
        entityType: 'brand',
        entityId: '12',
        entityName: 'Brand',
        views: '8',
        uniqueVisitors: '3',
      }];
    }
    return [];
  }, calls);

  const result = await service.getViewEventStats({
    entityType: 'brand',
    from: '2026-10-17T00:00:00.000Z',
    to: '2026-10-17T23:59:59.999Z',
  });

  assert.equal(result.totalViews, '8');
  assert.equal(result.uniqueVisitors, '3');
  assert.equal(result.topEntities[0].entityType, 'brand');
  assert.equal(result.dailyViews[0].views, '8');
  assert.ok(calls.every((call) => call.parameters.includes('brand')));
});
