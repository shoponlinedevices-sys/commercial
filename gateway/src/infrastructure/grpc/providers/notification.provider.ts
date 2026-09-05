import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface NotificationGrpcService {
  sendNotification(data: any): any;
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
}
