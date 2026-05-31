import { DataSource } from 'typeorm';
import { EmailEntity } from './email.entity';
export declare class EmailService {
    private readonly dataSource;
    private transporter;
    constructor(dataSource: DataSource);
    private get emailRepository();
    sendEmail(to: string, subject: string, body: string, template?: string, templateData?: Record<string, any>): Promise<{
        success: boolean;
        messageId: any;
        emailId: number;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        emailId: number;
        messageId?: undefined;
    }>;
    getEmailHistory(limit?: number): Promise<EmailEntity[]>;
    getEmailById(id: number): Promise<EmailEntity>;
    getEmailsByRecipient(to: string, limit?: number): Promise<EmailEntity[]>;
}
