import { DataSource } from 'typeorm';
import { NotificationEntity } from './notification.entity';
export declare class NotificationService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get notificationRepository();
    sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        messageId?: undefined;
    }>;
    getUserNotifications(userId: string): Promise<NotificationEntity[]>;
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        metadata?: Record<string, any>;
    }): Promise<NotificationEntity>;
    markAsRead(id: string): Promise<NotificationEntity>;
}
