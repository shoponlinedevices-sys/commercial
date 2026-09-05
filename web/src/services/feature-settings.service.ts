import { apiClient } from '../lib/api-client';
import { API_CONFIG } from '../lib/api-config';

export interface FeatureSetting {
  id: string;
  featureKey: string;
  featureName: string;
  isEnabled: boolean;
  config?: Record<string, unknown>;
  startTime?: string;
  endTime?: string;
}

export const featureSettingsService = {
  async getSetting(featureKey: string): Promise<FeatureSetting | null> {
    try {
      return await apiClient.get<FeatureSetting | null>(`/feature-settings/${featureKey}`, API_CONFIG.SALES_SERVICE_URL);
    } catch (error) {
      console.error(`Error loading feature setting ${featureKey}:`, error);
      return null;
    }
  },
};