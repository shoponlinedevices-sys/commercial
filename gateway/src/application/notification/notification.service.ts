import { Injectable } from '@nestjs/common';
import { NotificationProvider } from '../../infrastructure/grpc/providers/notification.provider';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationProvider: NotificationProvider) {}

  async getUserNotifications(userId: string) {
    return this.notificationProvider.getUserNotifications(userId);
  }

  async markAsRead(id: string) {
    return this.notificationProvider.markAsRead(id);
  }
}
