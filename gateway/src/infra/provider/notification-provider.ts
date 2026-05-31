import {
  Injectable,
  Inject,
  OnModuleInit,
} from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';

import { IGrpcNotificationService } from '../grpc-notifications.service';

@Injectable()
export class NotificationProvider
  implements OnModuleInit
{
  private notificationGrpcService!: IGrpcNotificationService;

  constructor(
    @Inject('GRPC_NOTIFICATIONS_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationGrpcService =
      this.client.getService<IGrpcNotificationService>(
        'NotificationService',
      );
  }

  async sendPushNotificationToUser(
    data: any,
  ) {
    return await firstValueFrom(
      this.notificationGrpcService.sendPushNotificationToUser(
        data,
      ),
    );
  }
}