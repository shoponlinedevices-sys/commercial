import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { User } from './user.entity';
import { DeliveryAddressEntity } from './delivery-address.entity';
import { PaymentMethodEntity } from './payment-method.entity';
import { HistoryLogEntity } from './history-log.entity';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  private get userProfileRepository() {
    return this.dataSource.getRepository(UserProfileEntity);
  }

  private get userRepository() {
    return this.dataSource.getRepository(User);
  }

  private get deliveryAddressRepository() {
    return this.dataSource.getRepository(DeliveryAddressEntity);
  }

  private get paymentMethodRepository() {
    return this.dataSource.getRepository(PaymentMethodEntity);
  }

  async getHistoryLogs(limit = 200) {
    return this.dataSource.getRepository(HistoryLogEntity).find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 500),
    });
  }

  // User Profile
  async getUserProfile(userId: number) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id: userId },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User profile not found');
    }

    return {
      userProfile: {
        id: user.id,
        username: userProfile?.username || user.username,
        fullName: userProfile?.fullName || user.fullName,
        phone: userProfile?.phone || null,
        email: userProfile?.email || user.email,
        avatar: userProfile?.avatar || null,
      },
    };
  }

  async updateUserProfile(data: {
    userId: number;
    fullName?: string;
    phone?: string;
    email?: string;
    avatar?: string;
  }) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id: data.userId },
    });

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    if (data.fullName) userProfile.fullName = data.fullName;
    if (data.phone) userProfile.phone = data.phone;
    if (data.email) userProfile.email = data.email;
    if (data.avatar) userProfile.avatar = data.avatar;

    const updated = await this.userProfileRepository.save(userProfile);
    return { userProfile: updated };
  }

  // Delivery Address
  async getDeliveryAddresses(userId: number) {
    const addresses = await this.deliveryAddressRepository.find({
      where: { userId },
    });
    return { addresses };
  }

  async getDeliveryAddress(id: number) {
    const address = await this.deliveryAddressRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new Error('Delivery address not found');
    }

    return { address };
  }

  async getDefaultDeliveryAddress(userId: number) {
    const address = await this.deliveryAddressRepository.findOne({
      where: { userId, isDefault: true },
    });

    if (!address) {
      throw new Error('Default delivery address not found');
    }

    return { address };
  }

  async createDeliveryAddress(data: {
    userId: number;
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
  }) {
    const address = this.deliveryAddressRepository.create(data);
    const saved = await this.deliveryAddressRepository.save(address);
    return { address: saved };
  }

  async updateDeliveryAddress(data: {
    id: number;
    recipientName?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    ward?: string;
    isDefault?: boolean;
  }) {
    const address = await this.deliveryAddressRepository.findOne({
      where: { id: data.id },
    });

    if (!address) {
      throw new Error('Delivery address not found');
    }

    if (data.recipientName) address.recipientName = data.recipientName;
    if (data.phone) address.phone = data.phone;
    if (data.address) address.address = data.address;
    if (data.city) address.city = data.city;
    if (data.district) address.district = data.district;
    if (data.ward) address.ward = data.ward;
    if (data.isDefault !== undefined) address.isDefault = data.isDefault;

    const updated = await this.deliveryAddressRepository.save(address);
    return { address: updated };
  }

  async deleteDeliveryAddress(id: number) {
    const address = await this.deliveryAddressRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new Error('Delivery address not found');
    }

    await this.deliveryAddressRepository.remove(address);
    return { success: true };
  }

  async setDefaultDeliveryAddress(userId: number, addressId: number) {
    // Unset all default addresses for this user
    await this.deliveryAddressRepository.update(
      { userId },
      { isDefault: false }
    );

    // Set the new default
    const address = await this.deliveryAddressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('Delivery address not found');
    }

    address.isDefault = true;
    await this.deliveryAddressRepository.save(address);
    return { success: true };
  }

  // Payment Method
  async getPaymentMethods(userId: number) {
    const paymentMethods = await this.paymentMethodRepository.find({
      where: { userId },
    });
    return { paymentMethods };
  }

  async getPaymentMethod(id: number) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    return { paymentMethod };
  }

  async getDefaultPaymentMethod(userId: number) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { userId, isDefault: true },
    });

    if (!paymentMethod) {
      throw new Error('Default payment method not found');
    }

    return { paymentMethod };
  }

  async createPaymentMethod(data: {
    userId: number;
    type: string;
    provider: string;
    accountNumber: string;
    accountName: string;
    isDefault: boolean;
  }) {
    const paymentMethod = this.paymentMethodRepository.create(data);
    const saved = await this.paymentMethodRepository.save(paymentMethod);
    return { paymentMethod: saved };
  }

  async updatePaymentMethod(data: {
    id: number;
    type?: string;
    provider?: string;
    accountNumber?: string;
    accountName?: string;
    isDefault?: boolean;
  }) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: data.id },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    if (data.type) paymentMethod.type = data.type;
    if (data.provider) paymentMethod.provider = data.provider;
    if (data.accountNumber) paymentMethod.accountNumber = data.accountNumber;
    if (data.accountName) paymentMethod.accountName = data.accountName;
    if (data.isDefault !== undefined) paymentMethod.isDefault = data.isDefault;

    const updated = await this.paymentMethodRepository.save(paymentMethod);
    return { paymentMethod: updated };
  }

  async deletePaymentMethod(id: number) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    await this.paymentMethodRepository.remove(paymentMethod);
    return { success: true };
  }

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number) {
    // Unset all default payment methods for this user
    await this.paymentMethodRepository.update(
      { userId },
      { isDefault: false }
    );

    // Set the new default
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    paymentMethod.isDefault = true;
    await this.paymentMethodRepository.save(paymentMethod);
    return { success: true };
  }
}
