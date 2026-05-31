import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { IdentityService } from '../../domain/identity/identity.service';
import { JwtStrategy } from '../../domain/identity/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_jwt_secret_change_me',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [IdentityService, AccountRepository, JwtStrategy],
  exports: [IdentityService],
})
export class IdentityModule {}
