import { Injectable } from '@nestjs/common';
import { EmailProvider } from '../../infrastructure/grpc/providers/email.provider';

@Injectable()
export class EmailService {
  constructor(private readonly emailProvider: EmailProvider) {}

  async getEmailHistory(limit: number = 50) {
    return this.emailProvider.getEmailHistory({ limit });
  }

  async getEmailById(id: number) {
    return this.emailProvider.getEmailById({ id });
  }

  async getEmailsByRecipient(to: string, limit: number = 50) {
    return this.emailProvider.getEmailsByRecipient({ to, limit });
  }

  async sendEmail(data: { to: string; subject: string; body: string; template?: string; templateData?: Record<string, any> }) {
    try {
      return await this.emailProvider.sendEmail(data);
    } catch (error) {
      console.error('Error sending email via microservice:', error);
      throw error;
    }
  }

  async sendOrderConfirmationEmail(data: {
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
  }) {
    try {
      return await this.emailProvider.sendOrderConfirmationEmail(data);
    } catch (error) {
      console.error('Error sending order confirmation email via microservice:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(data: {
    to: string;
    username: string;
    temporaryPassword: string;
  }) {
    try {
      return await this.emailProvider.sendPasswordResetEmail(data);
    } catch (error) {
      console.error('Error sending password reset email via microservice:', error);
      throw error;
    }
  }
}
