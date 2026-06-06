import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller('emails')
@GrpcService()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod('EmailService', 'SendEmail')
  sendEmail(data: any) {
    return this.emailService.sendEmail(
      data.to,
      data.subject,
      data.body,
      data.template,
      data.templateData,
    );
  }

  @GrpcMethod('EmailService', 'SendOrderConfirmationEmail')
  sendOrderConfirmationEmail(data: any) {
    return this.emailService.sendOrderConfirmationEmail(
      data.to,
      {
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        orderLines: data.orderLines || [],
        shippingAddress: data.shippingAddress,
        customerName: data.customerName,
      },
    );
  }

  @GrpcMethod('EmailService', 'SendPasswordResetEmail')
  sendPasswordResetEmail(data: any) {
    return this.emailService.sendPasswordResetEmail(
      data.to,
      data.username,
      data.temporaryPassword,
    );
  }

  @Post()
  async sendEmailRest(@Body() body: { to: string; subject: string; body: string; template?: string; templateData?: Record<string, any> }) {
    return this.emailService.sendEmail(
      body.to,
      body.subject,
      body.body,
      body.template,
      body.templateData,
    );
  }

  @Get('history')
  async getEmailHistory() {
    return this.emailService.getEmailHistory();
  }

  @Get('recipient/:to')
  async getEmailsByRecipient(@Param('to') to: string) {
    return this.emailService.getEmailsByRecipient(to);
  }

  @Get(':id')
  async getEmailById(@Param('id') id: string) {
    return this.emailService.getEmailById(parseInt(id, 10));
  }

  @Post('order-confirmation')
  async sendOrderConfirmationEmailRest(@Body() body: {
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
    return this.emailService.sendOrderConfirmationEmail(
      body.to,
      {
        orderId: body.orderId,
        totalAmount: body.totalAmount,
        orderLines: body.orderLines,
        shippingAddress: body.shippingAddress,
        customerName: body.customerName,
      },
    );
  }

  @Post('password-reset')
  async sendPasswordResetEmailRest(@Body() body: {
    to: string;
    username: string;
    temporaryPassword: string;
  }) {
    return this.emailService.sendPasswordResetEmail(
      body.to,
      body.username,
      body.temporaryPassword,
    );
  }
}
