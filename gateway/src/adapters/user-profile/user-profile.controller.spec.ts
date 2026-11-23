import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { NotFoundException } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';

test('missing user profile gRPC response is mapped to HTTP 404', async () => {
  const controller = new UserProfileController({
    getUserProfile: async () => {
      throw { code: 5 };
    },
  } as never);

  await assert.rejects(
    controller.getProfile('2'),
    (error: unknown) => error instanceof NotFoundException && error.getStatus() === 404,
  );
});
