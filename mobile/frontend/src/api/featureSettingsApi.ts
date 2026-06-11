import { rawApiRequest } from './httpClient';
import { SALES_SERVICE_BASE_URL } from './config';

export interface FeatureSetting {
  id: string;
  featureKey: string;
  featureName: string;
  isEnabled: boolean;
  config?: Record<string, any>;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

async function salesRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return await rawApiRequest<T>(path, options, 0, SALES_SERVICE_BASE_URL);
}

export async function fetchAllFeatureSettings(): Promise<FeatureSetting[]> {
  return await salesRequest<FeatureSetting[]>('/feature-settings');
}

export async function fetchEnabledFeatureSettings(): Promise<FeatureSetting[]> {
  return await salesRequest<FeatureSetting[]>('/feature-settings/enabled');
}

export async function fetchFeatureSettingByKey(featureKey: string): Promise<FeatureSetting | null> {
  return await salesRequest<FeatureSetting | null>(`/feature-settings/${featureKey}`);
}

export async function updateFeatureSetting(
  featureKey: string,
  data: {
    isEnabled?: boolean;
    config?: Record<string, any>;
    startTime?: string;
    endTime?: string;
  }
): Promise<FeatureSetting> {
  return await salesRequest<FeatureSetting>(`/feature-settings/${featureKey}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
