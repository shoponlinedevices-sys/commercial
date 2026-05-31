export declare class NotificationEntity {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    metadata?: Record<string, any>;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
