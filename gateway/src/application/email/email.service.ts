import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EmailEntity } from '../../infrastructure/database/entities/email.entity';
import { EmailProvider } from '../../infra/provider/email-provider';

@Injectable()
export class EmailService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
    private readonly emailProvider: EmailProvider,
  ) {}

  private get emailRepository() {
    return this.dataSource.getRepository(EmailEntity);
  }

  async sendEmail(data: { to: string; subject: string; body: string; template?: string; templateData?: Record<string, any> }) {
    try {
      return await this.emailProvider.sendEmail(data);
    } catch (error) {
      console.error('Error sending email via microservice:', error);
      throw error;
    }
  }

  async getEmailHistory(limit: number = 50) {
    return this.emailRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getEmailById(id: number) {
    return this.emailRepository.findOne({ where: { id } });
  }

  async getEmailsByRecipient(to: string, limit: number = 50) {
    return this.emailRepository.find({
      where: { to },
      order: { createdAt: 'DESC' },
      take: limit,
    });
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
