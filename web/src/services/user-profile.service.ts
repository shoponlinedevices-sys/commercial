import { apiClient } from '../lib/api-client';
import { GATEWAY_URL } from '../lib/api-config';

export interface UserProfile {
  id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
}

export const userProfileService = {
  async getProfile(userId: number): Promise<UserProfile> {
    return await apiClient.get<UserProfile>(`/user-profile/${userId}`, GATEWAY_URL);
  },

  async updateProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    return await apiClient.put<UserProfile>(`/user-profile/${userId}`, data, GATEWAY_URL);
  },
};
