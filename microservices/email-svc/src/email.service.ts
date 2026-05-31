import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { EmailEntity } from './email.entity';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private get emailRepository() {
    return this.dataSource.getRepository(EmailEntity);
  }

  async sendEmail(to: string, subject: string, body: string, template?: string, templateData?: Record<string, any>) {
    const email = this.emailRepository.create({
      to,
      subject,
      body,
      template,
      templateData,
      status: 'pending',
    });

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'shoponlinedevices@gmail.com',
        to,
        subject,
        html: body,
      };

      const info = await this.transporter.sendMail(mailOptions);

      email.status = 'sent';
      email.messageId = info.messageId;
      email.sentAt = new Date();

      await this.emailRepository.save(email);

      return {
        success: true,
        messageId: info.messageId,
        emailId: email.id,
      };
    } catch (error) {
      email.status = 'failed';
      email.error = error instanceof Error ? error.message : 'Unknown error';
      await this.emailRepository.save(email);

      console.error('Email sending error:', error);

      return {
        success: false,
        error: email.error,
        emailId: email.id,
      };
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
}
