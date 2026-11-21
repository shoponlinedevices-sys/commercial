import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './notification.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationController {
  private readonly notificationService: NotificationService;
  
  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  @GrpcMethod('NotificationService', 'SendNotification')
  sendNotification(data: any) {
    return this.notificationService.sendPushNotification(
      data.token,
      data.title,
      data.body,
      data.data,
    );
  }

  @GrpcMethod('NotificationService', 'CreateNotification')
  createNotificationGrpc(data: any) {
    return this.notificationService.createNotification({
      ...data,
      metadata: data.metadata || {},
    });
  }

  @GrpcMethod('NotificationService', 'GetUserNotifications')
  async getUserNotificationsGrpc(data: { userId: string }) {
    const notifications = await this.notificationService.getUserNotifications(data.userId);
    return { notifications: notifications.map((notification) => this.toGrpcNotification(notification)) };
  }

  @GrpcMethod('NotificationService', 'MarkNotificationAsRead')
  async markNotificationAsReadGrpc(data: { id: string }) {
    const notification = await this.notificationService.markAsRead(data.id);
    return { notification: notification ? this.toGrpcNotification(notification) : undefined };
  }

  private toGrpcNotification(notification: NotificationEntity) {
    return {
      ...notification,
      readAt: notification.readAt?.toISOString() || '',
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    };
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Post()
  async createNotification(@Body() body: { userId: string; title: string; message: string; type?: string; metadata?: Record<string, any> }) {
    return this.notificationService.createNotification(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}