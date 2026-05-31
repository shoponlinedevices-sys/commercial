import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

export type UserInfo = {
  id: number;
  username: string;
  email?: string;
};

export interface JwtPayload {
  sub: number;
  username: string;
}

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
};

@Injectable()
export class IdentityService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AuthTokens> {
    console.log(`[IdentityService] login called - username: ${username}, password length: ${password?.length || 0}`);

    if (!username || !password) {
      throw new BadRequestException('Tên đăng nhập và mật khẩu không được để trống');
    }

    const account = await this.accountRepository.findByUsername(username);
    if (!account) {
      console.error(`[IdentityService] Account not found for username: ${username}`);
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const passwordHash = createHash('sha256').update(password).digest('hex');
    if (account.password_hash !== passwordHash) {
      console.error(`[IdentityService] Password mismatch for username: ${username}`);
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    const user: UserInfo = {
      id: account.id!,
      username: account.username!,
      email: account.username,
    };

    const access_token = this.createAccessToken({ sub: user.id, username: user.username });
    const refresh_token = this.createRefreshToken({ sub: user.id, username: user.username });

    console.log('[IdentityService] Login success, tokens generated for user:', user.username);

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async register(username: string, password: string): Promise<UserInfo> {
    console.log(`[IdentityService] register called - username: ${username}, password length: ${password?.length || 0}`);

    if (!username || !password) {
      throw new BadRequestException('Tên đăng nhập và mật khẩu không được để trống');
    }

    const existingAccount = await this.accountRepository.findByUsername(username);
    if (existingAccount) {
      console.error(`[IdentityService] Username already exists: ${username}`);
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const account = await this.accountRepository.createAccount(username, password);
    console.log(`[IdentityService] Account created successfully:`, { id: account.id, username: account.username });

    const user: UserInfo = {
      id: account.id!,
      username: account.username!,
      email: account.username,
    };

    return user;
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const account = await this.accountRepository.findByUsername(payload.username);
      if (!account) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const access_token = this.createAccessToken({ sub: account.id!, username: account.username! });
      return { access_token };
    } catch (error) {
      console.error('[IdentityService] Refresh token validation failed:', error);
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  private createAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret(),
      expiresIn: '15m',
    });
  }

  private createRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret(),
      expiresIn: '7d',
    });
  }

  private jwtSecret(): string {
    return process.env.JWT_SECRET || 'default_jwt_secret_change_me';
  }
}
