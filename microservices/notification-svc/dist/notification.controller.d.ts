import { NotificationService } from './notification.service';
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
    createNotificationGrpc(data: any): Promise<import("./notification.entity").NotificationEntity>;
    getUserNotifications(userId: string): Promise<import("./notification.entity").NotificationEntity[]>;
    createNotification(body: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        metadata?: Record<string, any>;
    }): Promise<import("./notification.entity").NotificationEntity>;
    markAsRead(id: string): Promise<import("./notification.entity").NotificationEntity>;
}
