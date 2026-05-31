import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  private accountRepo: Repository<AccountEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.accountRepo = this.dataSource.getRepository(AccountEntity);
  }

  async findByUsername(username: string): Promise<AccountEntity | null> {
    return await this.accountRepo.findOne({ where: { username } });
  }

  async createAccount(username: string, password: string): Promise<AccountEntity> {
    const { createHash } = await import('crypto');
    const password_hash = createHash('sha256').update(password).digest('hex');
    const account = this.accountRepo.create({ username, password_hash });
    return await this.accountRepo.save(account);
  }

  async findAll(): Promise<AccountEntity[]> {
    return await this.accountRepo.find();
  }

  async findById(id: number): Promise<AccountEntity | null> {
    return await this.accountRepo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<AccountEntity>): Promise<AccountEntity> {
    await this.accountRepo.update(id, data);
    const account = await this.findById(id);
    if (!account) {
      throw new Error('Account not found after update');
    }
    return account;
  }
}
