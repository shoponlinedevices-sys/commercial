import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';
import { EmailService } from '../../application/email/email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendEmail(@Body() body: { to: string; subject: string; body: string; template?: string; templateData?: Record<string, any> }) {
    return this.emailService.sendEmail(body);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getEmailHistory() {
    return this.emailService.getEmailHistory();
  }

  @Get('recipient/:to')
  @UseGuards(JwtAuthGuard)
  async getEmailsByRecipient(@Param('to') to: string) {
    return this.emailService.getEmailsByRecipient(to);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEmailById(@Param('id') id: string) {
    return this.emailService.getEmailById(parseInt(id, 10));
  }
}
