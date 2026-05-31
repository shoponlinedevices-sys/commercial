import { rawApiRequest } from './httpClient';
import { getAccessToken, getRefreshToken, clearTokens } from './tokenStorage';
import { refreshAccessToken } from './authApi';
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

async function salesAuthorizedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = {
    ...(options.headers ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  try {
    return await rawApiRequest<T>(path, {
      ...options,
      headers,
    }, 0, SALES_SERVICE_BASE_URL);
  } catch (error) {
    const apiError = error as any;
    if (apiError.status === 401) {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearTokens();
        throw apiError;
      }

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        return await rawApiRequest<T>(path, {
          ...options,
          headers: {
            ...(options.headers ?? {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
        }, 0, SALES_SERVICE_BASE_URL);
      } catch (refreshError) {
        await clearTokens();
        throw refreshError;
      }
    }

    throw apiError;
  }
}

export async function fetchAllFeatureSettings(): Promise<FeatureSetting[]> {
  return await salesAuthorizedRequest<FeatureSetting[]>('/feature-settings');
}

export async function fetchEnabledFeatureSettings(): Promise<FeatureSetting[]> {
  return await salesAuthorizedRequest<FeatureSetting[]>('/feature-settings/enabled');
}

export async function fetchFeatureSettingByKey(featureKey: string): Promise<FeatureSetting | null> {
  return await salesAuthorizedRequest<FeatureSetting | null>(`/feature-settings/${featureKey}`);
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
  return await salesAuthorizedRequest<FeatureSetting>(`/feature-settings/${featureKey}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
