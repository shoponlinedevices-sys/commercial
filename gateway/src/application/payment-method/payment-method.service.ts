import { Injectable, BadRequestException } from '@nestjs/common';
import { ContactsGrpcClient } from '../../infrastructure/grpc/contacts-grpc.client';

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
  constructor(private readonly contactsClient: ContactsGrpcClient) {}

  async getAvailablePaymentMethods(userId: number): Promise<string[]> {
    const response = await this.contactsClient.getAvailablePaymentMethods({ userId });
    return response.paymentMethods || [];
  }

  async getAccountPaymentSettings(userId: number): Promise<AccountPaymentSettings> {
    const response = await this.contactsClient.getAccountPaymentSettings({ userId });
    return this.fromGrpcSettings(response);
  }

  async updateAccountPaymentSettings(userId: number, settings: Partial<AccountPaymentSettings>): Promise<AccountPaymentSettings> {
    try {
      const response = await this.contactsClient.updateAccountPaymentSettings({
        userId,
        settingsJson: JSON.stringify(settings),
      });
      return this.fromGrpcSettings(response);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 5) {
        throw new BadRequestException('Account not found. Please create an account first.');
      }
      throw error;
    }
  }

  private fromGrpcSettings(response: {
    prepaymentEnabled: number;
    cashOnDeliveryEnabled: number;
    paymentSettingsJson: string;
  }): AccountPaymentSettings {
    return {
      prepayment_enabled: response.prepaymentEnabled,
      cash_on_delivery_enabled: response.cashOnDeliveryEnabled,
      payment_settings: response.paymentSettingsJson
        ? JSON.parse(response.paymentSettingsJson)
        : undefined,
    };
  }
}
