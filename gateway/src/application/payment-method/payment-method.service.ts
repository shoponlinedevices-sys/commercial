import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentMethodRepository } from '../../infrastructure/database/repositories/payment-method.repository';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

export type PaymentMethod = {
  id?: number;
  user_id?: number;
  type?: string;
  provider?: string;
  card_number?: string;
  card_holder?: string;
  expiry_date?: string;
  is_default?: number;
};

export type AccountPaymentSettings = {
  prepayment_enabled?: number;
  cash_on_delivery_enabled?: number;
  payment_settings?: {
    show_only_prepayment?: boolean;
    show_both_options?: boolean;
  };
};

@Injectable()
export class PaymentMethodService {
  constructor(
    private paymentMethodRepository: PaymentMethodRepository,
    private accountRepository: AccountRepository
  ) {}

  async getPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.findByUserId(userId);
  }

  async getAvailablePaymentMethods(userId: number): Promise<string[]> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const settings = account.payment_settings || { show_only_prepayment: false, show_both_options: true };
    const availableMethods: string[] = [];

    if (settings.show_only_prepayment) {
      if (account.prepayment_enabled === 1) {
        availableMethods.push('prepayment');
      }
    } else if (settings.show_both_options) {
      if (account.prepayment_enabled === 1) {
        availableMethods.push('prepayment');
      }
      if (account.cash_on_delivery_enabled === 1) {
        availableMethods.push('cash_on_delivery');
      }
    }

    return availableMethods;
  }

  async getAccountPaymentSettings(userId: number): Promise<AccountPaymentSettings> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    return {
      prepayment_enabled: account.prepayment_enabled,
      cash_on_delivery_enabled: account.cash_on_delivery_enabled,
      payment_settings: account.payment_settings,
    };
  }

  async updateAccountPaymentSettings(userId: number, settings: Partial<AccountPaymentSettings>): Promise<AccountPaymentSettings> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const updateData: any = {};
    if (settings.prepayment_enabled !== undefined) {
      updateData.prepayment_enabled = settings.prepayment_enabled;
    }
    if (settings.cash_on_delivery_enabled !== undefined) {
      updateData.cash_on_delivery_enabled = settings.cash_on_delivery_enabled;
    }
    if (settings.payment_settings !== undefined) {
      updateData.payment_settings = settings.payment_settings;
    }

    await this.accountRepository.update(userId, updateData);
    return await this.getAccountPaymentSettings(userId);
  }

  async getPaymentMethod(id: number): Promise<PaymentMethod | null> {
    const payment = await this.paymentMethodRepository.findById(id);
    if (!payment) {
      throw new BadRequestException('Payment method not found');
    }
    return payment;
  }

  async createPaymentMethod(userId: number, data: Omit<PaymentMethod, 'id' | 'user_id'>): Promise<PaymentMethod> {
    const paymentData = { ...data, user_id: userId };
    const payment = await this.paymentMethodRepository.createPaymentMethod(paymentData);
    
    // If this is the first payment method or marked as default, set it as default
    const payments = await this.paymentMethodRepository.findByUserId(userId);
    if (payments.length === 1 || data.is_default === 1) {
      await this.paymentMethodRepository.setDefaultPaymentMethod(userId, payment.id!);
    }
    
    return payment;
  }

  async updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const payment = await this.paymentMethodRepository.updatePaymentMethod(id, data);
    if (!payment) {
      throw new BadRequestException('Payment method not found');
    }
    
    // If setting as default, update all other payment methods
    if (data.is_default === 1) {
      await this.paymentMethodRepository.setDefaultPaymentMethod(payment.user_id!, id);
    }
    
    return payment;
  }

  async deletePaymentMethod(id: number): Promise<void> {
    const payment = await this.paymentMethodRepository.findById(id);
    if (!payment) {
      throw new BadRequestException('Payment method not found');
    }
    await this.paymentMethodRepository.deletePaymentMethod(id);
  }

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<void> {
    const payment = await this.paymentMethodRepository.findById(paymentMethodId);
    if (!payment || payment.user_id !== userId) {
      throw new BadRequestException('Payment method not found or does not belong to user');
    }
    await this.paymentMethodRepository.setDefaultPaymentMethod(userId, paymentMethodId);
  }

  async getDefaultPaymentMethod(userId: number): Promise<PaymentMethod | null> {
    return await this.paymentMethodRepository.getDefaultPaymentMethod(userId);
  }
}
