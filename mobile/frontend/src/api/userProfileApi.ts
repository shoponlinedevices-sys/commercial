import { API_BASE_URL } from './config';

export const userProfileApi = {
  async getProfile(userId: number) {
    console.log(`API: Fetching profile for user ${userId} from ${API_BASE_URL}/user-profile/${userId}`);
    const response = await fetch(`${API_BASE_URL}/user-profile/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  async updateProfile(userId: number, data: any) {
    console.log(`API: Updating profile for user ${userId} at ${API_BASE_URL}/user-profile/${userId}`, data);
    const response = await fetch(`${API_BASE_URL}/user-profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log(`API: Response status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API: Error response: ${errorText}`);
      throw new Error('Failed to update user profile');
    }
    const result = await response.json();
    console.log('API: Update success:', result);
    return result;
  },
};

export const deliveryAddressApi = {
  async getAddresses(userId: number) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
  },

  async getAddress(id: number) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/${id}`);
    if (!response.ok) throw new Error('Failed to fetch address');
    return response.json();
  },

  async getDefaultAddress(userId: number) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/default/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch default address');
    return response.json();
  },

  async createAddress(userId: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/user/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create address');
    return response.json();
  },

  async updateAddress(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update address');
    return response.json();
  },

  async deleteAddress(id: number) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete address');
    return response.json();
  },

  async setDefaultAddress(userId: number, addressId: number) {
    const response = await fetch(`${API_BASE_URL}/delivery-address/default/${userId}/${addressId}`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to set default address');
    return response.json();
  },
};

export const paymentMethodApi = {
  async getPaymentMethods(userId: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch payment methods');
    return response.json();
  },

  async getPaymentMethod(id: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/${id}`);
    if (!response.ok) throw new Error('Failed to fetch payment method');
    return response.json();
  },

  async getDefaultPaymentMethod(userId: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/default/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch default payment method');
    return response.json();
  },

  async createPaymentMethod(userId: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/payment-method/user/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment method');
    return response.json();
  },

  async updatePaymentMethod(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/payment-method/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update payment method');
    return response.json();
  },

  async deletePaymentMethod(id: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete payment method');
    return response.json();
  },

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/default/${userId}/${paymentMethodId}`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to set default payment method');
    return response.json();
  },

  async getAvailablePaymentMethods(userId: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/available/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch available payment methods');
    return response.json();
  },

  async getAccountPaymentSettings(userId: number) {
    const response = await fetch(`${API_BASE_URL}/payment-method/settings/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch account payment settings');
    return response.json();
  },

  async updateAccountPaymentSettings(userId: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/payment-method/settings/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update account payment settings');
    return response.json();
  },
};
