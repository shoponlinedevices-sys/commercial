import { EmailService } from './email.service';
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
    getEmailHistory(): Promise<import("./email.entity").EmailEntity[]>;
    getEmailsByRecipient(to: string): Promise<import("./email.entity").EmailEntity[]>;
    getEmailById(id: string): Promise<import("./email.entity").EmailEntity>;
}
