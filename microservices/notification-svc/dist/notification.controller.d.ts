import { NotificationService } from './notification.service';
import { NotificationEntity } from './notification.entity';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(data: any): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        messageId?: undefined;
    }>;
    createNotificationGrpc(data: any): Promise<NotificationEntity>;
    getUserNotificationsGrpc(data: {
        userId: string;
    }): Promise<{
        notifications: {
            readAt: string;
            createdAt: string;
            updatedAt: string;
            id: string;
            userId: string;
            title: string;
            message: string;
            type: string;
            isRead: boolean;
            metadata?: Record<string, any>;
        }[];
    }>;
    markNotificationAsReadGrpc(data: {
        id: string;
    }): Promise<{
        notification: {
            readAt: string;
            createdAt: string;
            updatedAt: string;
            id: string;
            userId: string;
            title: string;
            message: string;
            type: string;
            isRead: boolean;
            metadata?: Record<string, any>;
        };
    }>;
    private toGrpcNotification;
    getUserNotifications(userId: string): Promise<NotificationEntity[]>;
    createNotification(body: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        metadata?: Record<string, any>;
    }): Promise<NotificationEntity>;
    markAsRead(id: string): Promise<NotificationEntity>;
}
