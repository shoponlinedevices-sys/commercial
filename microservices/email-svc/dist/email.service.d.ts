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
    sendOrderConfirmationEmail(to: string, orderData: {
        orderId: string;
        totalAmount: number;
        orderLines: Array<{
            productId: string;
            productName: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            productImage?: string;
        }>;
        shippingAddress?: string;
        customerName?: string;
    }): Promise<{
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
    sendPasswordResetEmail(to: string, username: string, temporaryPassword: string): Promise<{
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
}
