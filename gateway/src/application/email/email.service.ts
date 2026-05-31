import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { EmailEntity } from '../../infrastructure/database/entities/email.entity';

@Injectable()
export class EmailService {
  private client: ClientProxy;

  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'email',
        protoPath: join(__dirname, '../../../../packages/contracts/proto/email.proto'),
        url: 'localhost:50053',
      },
    });
  }

  private get emailRepository() {
    return this.dataSource.getRepository(EmailEntity);
  }

  async sendEmail(data: { to: string; subject: string; body: string; template?: string; templateData?: Record<string, any> }) {
    try {
      return await this.client.send('SendEmail', data).toPromise();
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
}
