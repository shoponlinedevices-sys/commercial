import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../domain/identity/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_jwt_secret_change_me',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [JwtStrategy],
})
export class IdentityModule {}
