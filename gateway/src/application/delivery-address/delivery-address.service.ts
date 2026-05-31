import { Injectable, BadRequestException } from '@nestjs/common';
import { DeliveryAddressRepository } from '../../infrastructure/database/repositories/delivery-address.repository';

export type DeliveryAddress = {
  id?: number;
  user_id?: number;
  recipient_name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  street_address?: string;
  is_default?: number;
};

@Injectable()
export class DeliveryAddressService {
  constructor(private deliveryAddressRepository: DeliveryAddressRepository) {}

  async getAddresses(userId: number): Promise<DeliveryAddress[]> {
    return await this.deliveryAddressRepository.findByUserId(userId);
  }

  async getAddress(id: number): Promise<DeliveryAddress | null> {
    const address = await this.deliveryAddressRepository.findById(id);
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    return address;
  }

  async createAddress(userId: number, data: Omit<DeliveryAddress, 'id' | 'user_id'>): Promise<DeliveryAddress> {
    const addressData = { ...data, user_id: userId };
    const address = await this.deliveryAddressRepository.createAddress(addressData);
    
    // If this is the first address or marked as default, set it as default
    const addresses = await this.deliveryAddressRepository.findByUserId(userId);
    if (addresses.length === 1 || data.is_default === 1) {
      await this.deliveryAddressRepository.setDefaultAddress(userId, address.id!);
    }
    
    return address;
  }

  async updateAddress(id: number, data: Partial<DeliveryAddress>): Promise<DeliveryAddress> {
    const address = await this.deliveryAddressRepository.updateAddress(id, data);
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    
    // If setting as default, update all other addresses
    if (data.is_default === 1) {
      await this.deliveryAddressRepository.setDefaultAddress(address.user_id!, id);
    }
    
    return address;
  }

  async deleteAddress(id: number): Promise<void> {
    const address = await this.deliveryAddressRepository.findById(id);
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    await this.deliveryAddressRepository.deleteAddress(id);
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<void> {
    const address = await this.deliveryAddressRepository.findById(addressId);
    if (!address || address.user_id !== userId) {
      throw new BadRequestException('Address not found or does not belong to user');
    }
    await this.deliveryAddressRepository.setDefaultAddress(userId, addressId);
  }

  async getDefaultAddress(userId: number): Promise<DeliveryAddress | null> {
    return await this.deliveryAddressRepository.getDefaultAddress(userId);
  }
}
