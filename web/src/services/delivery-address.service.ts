import { apiClient } from '../lib/api-client';
import { GATEWAY_URL } from '../lib/api-config';

export interface DeliveryAddress {
  id?: number;
  recipient_name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  street_address?: string;
  is_default?: number;
}

export const deliveryAddressService = {
  async getAddresses(userId: number): Promise<DeliveryAddress[]> {
    return await apiClient.get<DeliveryAddress[]>(`/delivery-address/user/${userId}`, GATEWAY_URL);
  },

  async getAddress(id: number): Promise<DeliveryAddress | null> {
    return await apiClient.get<DeliveryAddress>(`/delivery-address/${id}`, GATEWAY_URL);
  },

  async getDefaultAddress(userId: number): Promise<DeliveryAddress | null> {
    return await apiClient.get<DeliveryAddress>(`/delivery-address/default/${userId}`, GATEWAY_URL);
  },

  async createAddress(userId: number, data: Omit<DeliveryAddress, 'id'>): Promise<DeliveryAddress> {
    return await apiClient.post<DeliveryAddress>(`/delivery-address/user/${userId}`, data, GATEWAY_URL);
  },

  async updateAddress(id: number, data: Partial<DeliveryAddress>): Promise<DeliveryAddress> {
    return await apiClient.put<DeliveryAddress>(`/delivery-address/${id}`, data, GATEWAY_URL);
  },

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/delivery-address/${id}`, GATEWAY_URL);
  },

  async setDefaultAddress(userId: number, addressId: number): Promise<void> {
    await apiClient.put(`/delivery-address/default/${userId}/${addressId}`, {}, GATEWAY_URL);
  },
};
