import { Injectable, BadRequestException } from '@nestjs/common';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { AccountEntity } from '../../infrastructure/database/entities/account.entity';

export type UserProfile = {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
};

@Injectable()
export class UserProfileService {
  constructor(private accountRepository: AccountRepository) {}

  async getProfile(userId: number): Promise<UserProfile> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      throw new BadRequestException('User not found');
    }
    return {
      id: account.id!,
      username: account.username!,
      email: account.email,
      full_name: account.full_name,
      phone: account.phone,
      role: account.role,
    };
  }

  async updateProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      throw new BadRequestException('User not found');
    }

    const updateData: Partial<AccountEntity> = {};
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.email !== undefined) {
      const findExistingEmail = await this.accountRepository.findByEmail(data.email);
      if (findExistingEmail && findExistingEmail.id) {
        throw new BadRequestException('Email already exists');
      }
      updateData.email = data.email;
    }
    if(data.phone !== undefined){
      const findExistingPhone = await this.accountRepository.findByPhone(data.phone);
      if(findExistingPhone && findExistingPhone.id){
        throw new BadRequestException('Phone already exist');
      }
    }
    if (data.phone !== undefined) updateData.phone = data.phone;

    const updatedAccount = await this.accountRepository.update(userId, updateData);
    return {
      id: updatedAccount.id!,
      username: updatedAccount.username!,
      email: updatedAccount.email,
      full_name: updatedAccount.full_name,
      phone: updatedAccount.phone,
      role: updatedAccount.role,
    };
  }
}
