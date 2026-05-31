export declare class EmailEntity {
    id: number;
    to: string;
    subject: string;
    body: string;
    template: string;
    templateData: Record<string, any>;
    status: string;
    messageId: string;
    error: string;
    createdAt: Date;
    sentAt: Date;
}
