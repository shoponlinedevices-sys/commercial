import { rawApiRequest, ApiError } from './httpClient';
import { getAccessToken, getRefreshToken, clearTokens } from './tokenStorage';
import { refreshAccessToken } from './authApi';
import { NOTIFICATION_API_BASE_URL } from './config';

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

async function notificationAuthorizedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = {
    ...(options.headers ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  try {
    return await rawApiRequest<T>(path, {
      ...options,
      headers,
    }, 0, NOTIFICATION_API_BASE_URL);
  } catch (error) {
    const apiError = error as ApiError;
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
        }, 0, NOTIFICATION_API_BASE_URL);
      } catch (refreshError) {
        await clearTokens();
        throw refreshError;
      }
    }

    throw apiError;
  }
}

export async function getUserNotifications(userId: string): Promise<INotification[]> {
  return await notificationAuthorizedRequest<INotification[]>(`/notifications/user/${userId}`, {
    method: 'GET',
  });
}

export async function markNotificationAsRead(notificationId: string): Promise<INotification> {
  return await notificationAuthorizedRequest<INotification>(`/notifications/${notificationId}/read`, {
    method: 'POST',
  });
}
