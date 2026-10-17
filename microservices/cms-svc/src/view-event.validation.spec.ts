import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  validateRecordViewEvent,
  validateStatsFilters,
  validateViewEventFilters,
} from './view-event.validation';

test('accepts all supported entity types with positive unsigned IDs', () => {
  for (const entityType of ['category', 'brand', 'product']) {
    const event = validateRecordViewEvent({
      entityType,
      entityId: '18446744073709551615',
      visitorId: '',
      sessionId: '',
      userId: '',
      pageUrl: '',
      referrerUrl: '',
    });
    assert.equal(event.entityType, entityType);
  }
});

test('rejects unsupported types, malformed IDs, and malformed visitor identifiers', () => {
  const base = {
    entityType: 'product',
    entityId: '1',
    visitorId: '',
    sessionId: '',
    userId: '',
    pageUrl: '',
    referrerUrl: '',
  };
  assert.throws(() => validateRecordViewEvent({ ...base, entityType: 'order' }));
  assert.throws(() => validateRecordViewEvent({ ...base, entityId: '0' }));
  assert.throws(() => validateRecordViewEvent({ ...base, entityId: '18446744073709551616' }));
  assert.throws(() => validateRecordViewEvent({ ...base, visitorId: 'not-a-uuid' }));
  assert.throws(() => validateRecordViewEvent({ ...base, pageUrl: 'javascript:alert(1)' }));
});

test('validates date ranges and bounded pagination filters', () => {
  const result = validateViewEventFilters({
    entityType: 'brand',
    entityId: '',
    entitySearch: '',
    from: '2026-10-01T00:00:00.000Z',
    to: '2026-10-17T23:59:59.000Z',
    visitorId: '',
    sessionId: '',
    userId: '',
    page: 2,
    limit: 50,
  });
  assert.equal(result.page, 2);
  assert.equal(result.limit, 50);
  assert.throws(() => validateViewEventFilters({
    entityType: '',
    entityId: '',
    entitySearch: '',
    from: '2026-10-18T00:00:00.000Z',
    to: '2026-10-17T00:00:00.000Z',
    visitorId: '',
    sessionId: '',
    userId: '',
    page: 1,
    limit: 25,
  }));
  assert.throws(() => validateViewEventFilters({
    entityType: '',
    entityId: '',
    entitySearch: '',
    from: '',
    to: '',
    visitorId: '',
    sessionId: '',
    userId: '',
    page: 1,
    limit: 101,
  }));
});

test('statistics filters preserve the requested period and entity type', () => {
  const filters = validateStatsFilters({
    entityType: 'category',
    from: '2026-10-01T00:00:00.000Z',
    to: '',
  });
  assert.equal(filters.entityType, 'category');
  assert.equal(filters.from, '2026-10-01 00:00:00');
});

test('removes query strings and fragments from stored URLs', () => {
  const event = validateRecordViewEvent({
    entityType: 'product',
    entityId: '1',
    visitorId: '',
    sessionId: '',
    userId: '',
    pageUrl: 'https://shop.example/products/1?secret=value#details',
    referrerUrl: 'https://shop.example/search?q=private',
  });
  assert.equal(event.pageUrl, 'https://shop.example/products/1');
  assert.equal(event.referrerUrl, 'https://shop.example/search');
});
