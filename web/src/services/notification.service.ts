import { apiClient } from '../lib/api-client';
import { NOTIFICATION_BASE_URL } from '../lib/api-config';
import { NotificationItem } from '../types';

export const notificationService = {
  async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    return await apiClient.get<NotificationItem[]>(`/notifications/user/${userId}`, NOTIFICATION_BASE_URL);
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.post(`/notifications/${notificationId}/read`, {}, NOTIFICATION_BASE_URL);
  },

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationItem> {
    return await apiClient.post<NotificationItem>('/notifications', data, NOTIFICATION_BASE_URL);
  },
};
