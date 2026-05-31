import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import admin from './firebase.config';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  private get notificationRepository() {
    return this.dataSource.getRepository(NotificationEntity);
  }
  
  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('FCM Error:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createNotification(data: { userId: string; title: string; message: string; type?: string; metadata?: Record<string, any> }) {
    const notification = this.notificationRepository.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      metadata: data.metadata,
      isRead: false,
    });
    return this.notificationRepository.save(notification);
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.isRead = true;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }
}