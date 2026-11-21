import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata: Record<string, string>;
  isRead: boolean;
  readAt: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationGrpcService {
  sendNotification(data: any): Observable<any>;
  getUserNotifications(data: { userId: string }): Observable<{ notifications: NotificationRecord[] }>;
  markNotificationAsRead(data: { id: string }): Observable<{ notification?: NotificationRecord }>;
}

@Injectable()
export class NotificationProvider implements OnModuleInit {
  private notificationService!: NotificationGrpcService;

  constructor(@Inject('GRPC_NOTIFICATIONS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.notificationService = this.client.getService<NotificationGrpcService>('NotificationService');
  }

  async sendPushNotificationToUser(data: any) {
    return firstValueFrom(this.notificationService.sendNotification(data));
  }

  async getUserNotifications(userId: string) {
    const response = await firstValueFrom(this.notificationService.getUserNotifications({ userId }));
    return response.notifications;
  }

  async markAsRead(id: string) {
    const response = await firstValueFrom(this.notificationService.markNotificationAsRead({ id }));
    return response.notification;
  }
}
