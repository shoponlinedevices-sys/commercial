import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { ViewEventsAdminGuard } from '../view-events/view-events-admin.guard';
import { SupplierCostsController } from './supplier-costs.controller';

test('supplier and product-cost routes require active administrator authentication', () => {
  const guards = Reflect.getMetadata(GUARDS_METADATA, SupplierCostsController) as unknown[];
  assert.ok(guards.includes(JwtAuthGuard));
  assert.ok(guards.includes(ViewEventsAdminGuard));
});
