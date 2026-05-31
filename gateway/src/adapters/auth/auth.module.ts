import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../../application/auth/auth.service';
import { IdentityModule } from '../identity/identity.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [AuthController],
  providers: [AuthService, AccountRepository],
  exports: [AuthService],
})
export class AuthModule {}