import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeliveryAddressEntity } from '../entities/delivery-address.entity';

@Injectable()
export class DeliveryAddressRepository {
  private addressRepo: Repository<DeliveryAddressEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.addressRepo = this.dataSource.getRepository(DeliveryAddressEntity);
  }

  async findByUserId(userId: number): Promise<DeliveryAddressEntity[]> {
    return await this.addressRepo.find({ where: { user_id: userId } });
  }

  async findById(id: number): Promise<DeliveryAddressEntity | null> {
    return await this.addressRepo.findOne({ where: { id } });
  }

  async createAddress(data: Partial<DeliveryAddressEntity>): Promise<DeliveryAddressEntity> {
    const address = this.addressRepo.create(data);
    return await this.addressRepo.save(address);
  }

  async updateAddress(id: number, data: Partial<DeliveryAddressEntity>): Promise<DeliveryAddressEntity | null> {
    await this.addressRepo.update(id, data);
    return await this.findById(id);
  }

  async deleteAddress(id: number): Promise<void> {
    await this.addressRepo.delete(id);
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<void> {
    // Reset all addresses for this user to non-default
    await this.addressRepo.update({ user_id: userId }, { is_default: 0 });
    // Set the specified address as default
    await this.addressRepo.update(addressId, { is_default: 1 });
  }

  async getDefaultAddress(userId: number): Promise<DeliveryAddressEntity | null> {
    return await this.addressRepo.findOne({ where: { user_id: userId, is_default: 1 } });
  }
}
