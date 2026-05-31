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
      // Return default available methods if account doesn't exist
      return ['cash', 'card', 'bank_transfer', 'momo', 'zalopay'];
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

    // Always include basic payment methods
    if (availableMethods.length === 0) {
      availableMethods.push('cash', 'card', 'bank_transfer', 'momo', 'zalopay');
    }

    return availableMethods;
  }

  async getAccountPaymentSettings(userId: number): Promise<AccountPaymentSettings> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      // Return default settings if account doesn't exist
      return {
        prepayment_enabled: 1,
        cash_on_delivery_enabled: 1,
        payment_settings: {
          show_only_prepayment: false,
          show_both_options: true,
        },
      };
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
      // Create account if it doesn't exist
      throw new BadRequestException('Account not found. Please create an account first.');
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

    // Check if this is the default payment method
    if (payment.is_default === 1) {
      // Get all payment methods for this user
      const userPayments = await this.paymentMethodRepository.findByUserId(payment.user_id!);
      
      // If this is the only payment method, prevent deletion
      if (userPayments.length === 1) {
        throw new BadRequestException('Cannot delete the only payment method. Please add another payment method first.');
      }
      
      // Set another payment method as default before deleting this one
      const otherPayment = userPayments.find(p => p.id !== id);
      if (otherPayment) {
        await this.paymentMethodRepository.setDefaultPaymentMethod(payment.user_id!, otherPayment.id!);
      }
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
