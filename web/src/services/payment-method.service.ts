import { apiClient } from '../lib/api-client';
import { GATEWAY_URL } from '../lib/api-config';

export interface PaymentMethod {
  id?: number;
  type?: string;
  provider?: string;
  card_number?: string;
  card_holder?: string;
  expiry_date?: string;
  is_default?: number;
}

export interface AccountPaymentSettings {
  prepayment_enabled?: number;
  cash_on_delivery_enabled?: number;
  payment_settings?: {
    show_only_prepayment?: boolean;
    show_both_options?: boolean;
  };
}

export const paymentMethodService = {
  async getPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    return await apiClient.get<PaymentMethod[]>(`/payment-method/user/${userId}`, GATEWAY_URL);
  },

  async getPaymentMethod(id: number): Promise<PaymentMethod | null> {
    return await apiClient.get<PaymentMethod>(`/payment-method/${id}`, GATEWAY_URL);
  },

  async getDefaultPaymentMethod(userId: number): Promise<PaymentMethod | null> {
    return await apiClient.get<PaymentMethod>(`/payment-method/default/${userId}`, GATEWAY_URL);
  },

  async getAvailablePaymentMethods(userId: number): Promise<string[]> {
    return await apiClient.get<string[]>(`/payment-method/available/${userId}`, GATEWAY_URL);
  },

  async getAccountPaymentSettings(userId: number): Promise<AccountPaymentSettings> {
    return await apiClient.get<AccountPaymentSettings>(`/payment-method/settings/${userId}`, GATEWAY_URL);
  },

  async updateAccountPaymentSettings(userId: number, data: Partial<AccountPaymentSettings>): Promise<AccountPaymentSettings> {
    return await apiClient.put<AccountPaymentSettings>(`/payment-method/settings/${userId}`, data, GATEWAY_URL);
  },

  async createPaymentMethod(userId: number, data: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    return await apiClient.post<PaymentMethod>(`/payment-method/user/${userId}`, data, GATEWAY_URL);
  },

  async updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return await apiClient.put<PaymentMethod>(`/payment-method/${id}`, data, GATEWAY_URL);
  },

  async deletePaymentMethod(id: number): Promise<void> {
    await apiClient.delete(`/payment-method/${id}`, GATEWAY_URL);
  },

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<void> {
    await apiClient.put(`/payment-method/default/${userId}/${paymentMethodId}`, {}, GATEWAY_URL);
  },
};
