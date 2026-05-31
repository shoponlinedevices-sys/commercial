import { apiClient } from '../lib/api-client';
import { NotificationItem } from '../types';

export const notificationService = {
  async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    return await apiClient.get<NotificationItem[]>(`/notifications/user/${userId}`);
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.post(`/notifications/${notificationId}/read`, {});
  },

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationItem> {
    return await apiClient.post<NotificationItem>('/notifications', data);
  },
};
