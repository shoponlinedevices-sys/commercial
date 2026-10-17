import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { ExecutionContext } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../domain/identity/optional-jwt-auth.guard';
import { ViewEventsAdminGuard } from './view-events-admin.guard';
import { ViewEventsController } from './view-events.controller';

test('analytics routes require JWT authentication and the administrator guard', () => {
  for (const method of ['list', 'stats', 'entityTotals']) {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      ViewEventsController.prototype[method as keyof ViewEventsController],
    ) as unknown[];
    assert.ok(guards.includes(JwtAuthGuard), `${method} route should require JWT auth`);
    assert.ok(guards.includes(ViewEventsAdminGuard), `${method} route should require administrator role`);
  }
});

test('public event recording permits requests without a bearer token', () => {
  const guard = new OptionalJwtAuthGuard();
  const context = {
    switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
  } as ExecutionContext;

  assert.equal(guard.canActivate(context), true);
});

test('administrator guard validates account status and role and propagates lookup failures', async () => {
  const context = (id: number) => ({
    switchToHttp: () => ({ getRequest: () => ({ user: { id } }) }),
  }) as ExecutionContext;
  const adminGuard = new ViewEventsAdminGuard({
    findById: async () => ({ role: 'admin', status: 1 }),
  });
  const userGuard = new ViewEventsAdminGuard({
    findById: async () => ({ role: 'user', status: 1 }),
  });
  const inactiveGuard = new ViewEventsAdminGuard({
    findById: async () => ({ role: 'admin', status: 0 }),
  });
  const missingAccountGuard = new ViewEventsAdminGuard({
    findById: async () => null,
  });
  const databaseError = new Error('Database unavailable');
  const failedLookupGuard = new ViewEventsAdminGuard({
    findById: async () => { throw databaseError; },
  });

  assert.equal(await adminGuard.canActivate(context(1)), true);
  await assert.rejects(userGuard.canActivate(context(2)), /Administrator access is required/);
  await assert.rejects(inactiveGuard.canActivate(context(3)), /Account is not active/);
  await assert.rejects(missingAccountGuard.canActivate(context(4)), /Account is not active/);
  await assert.rejects(failedLookupGuard.canActivate(context(5)), databaseError);
});

test('recording rejects client-supplied user identity', async () => {
  const controller = new ViewEventsController({} as never);

  await assert.rejects(
    controller.record({ entityType: 'product', entityId: '1', userId: '999' }, {}),
    /userId is derived from the authenticated session/,
  );
});
