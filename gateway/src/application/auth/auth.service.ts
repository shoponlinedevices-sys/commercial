import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

export type UserInfo = {
  id: number;
  username: string;
  email?: string;
};

@Injectable()
export class AuthService {
  constructor(private accountRepository: AccountRepository) {}

  async login(username: string, password: string): Promise<UserInfo> {
    console.log(`[AuthService] login called - username: ${username}, password length: ${password?.length || 0}`);
    try {
      console.log(`[AuthService] Finding account by username: ${username}`);
      const account = await this.accountRepository.findByUsername(username);
      console.log(`[AuthService] Account found:`, account ? { id: account.id, username: account.username } : 'NOT FOUND');

      if (!account) {
        console.error(`[AuthService] Account not found for username: ${username}`);
        throw new BadRequestException('Tài khoản không tồn tại');
      }

      const hash = createHash('sha256').update(password).digest('hex');
      console.log(`[AuthService] Comparing passwords - stored: ${account.password_hash}, provided: ${password}, hash: ${hash}`);
      if (account.password_hash !== hash) {
        console.error(`[AuthService] Password mismatch for username: ${username}`);
        throw new BadRequestException('Mật khẩu không chính xác');
      }

      const result = {
        id: account.id!,
        username: account.username!,
        email: account.username!, // Using username as email for now
      };
      console.log(`[AuthService] Login success:`, result);
      return result;
    } catch (error) {
      console.error(`[AuthService] Login error caught:`, error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi đăng nhập: ' + (error as Error).message);
    }
  }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    const account = await this.accountRepository.findByUsername(username);
    if (!account) {
      return false;
    }
    const hash = createHash('sha256').update(password).digest('hex');
    return account.password_hash === hash;
  }
}
