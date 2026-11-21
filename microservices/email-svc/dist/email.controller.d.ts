import { EmailService } from './email.service';
import { EmailEntity } from './email.entity';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendEmail(data: any): Promise<{
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
    sendOrderConfirmationEmail(data: any): Promise<{
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
    sendPasswordResetEmail(data: any): Promise<{
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
    getEmailHistoryGrpc(data: {
        limit?: number;
    }): Promise<{
        emails: {
            createdAt: string;
            sentAt: string;
            id: number;
            to: string;
            subject: string;
            body: string;
            template: string;
            templateData: Record<string, any>;
            status: string;
            messageId: string;
            error: string;
        }[];
    }>;
    getEmailsByRecipientGrpc(data: {
        to: string;
        limit?: number;
    }): Promise<{
        emails: {
            createdAt: string;
            sentAt: string;
            id: number;
            to: string;
            subject: string;
            body: string;
            template: string;
            templateData: Record<string, any>;
            status: string;
            messageId: string;
            error: string;
        }[];
    }>;
    getEmailByIdGrpc(data: {
        id: number;
    }): Promise<{
        email: {
            createdAt: string;
            sentAt: string;
            id: number;
            to: string;
            subject: string;
            body: string;
            template: string;
            templateData: Record<string, any>;
            status: string;
            messageId: string;
            error: string;
        };
    }>;
    private toGrpcEmail;
    sendEmailRest(body: {
        to: string;
        subject: string;
        body: string;
        template?: string;
        templateData?: Record<string, any>;
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
    getEmailHistory(): Promise<EmailEntity[]>;
    getEmailsByRecipient(to: string): Promise<EmailEntity[]>;
    getEmailById(id: string): Promise<EmailEntity>;
    sendOrderConfirmationEmailRest(body: {
        to: string;
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
    sendPasswordResetEmailRest(body: {
        to: string;
        username: string;
        temporaryPassword: string;
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
}
