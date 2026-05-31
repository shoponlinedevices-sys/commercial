import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller('emails')
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
}
