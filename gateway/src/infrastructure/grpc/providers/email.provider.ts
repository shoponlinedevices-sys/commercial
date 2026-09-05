import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcEmailService } from '../email.grpc.interface';

@Injectable()
export class EmailProvider implements OnModuleInit {
  private grpcEmailService!: IGrpcEmailService;

  constructor(@Inject('GRPC_EMAILS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcEmailService = this.client.getService<IGrpcEmailService>('EmailService');
  }

  async sendEmail(data: any) {
    return firstValueFrom(this.grpcEmailService.sendEmail(data));
  }

  async sendOrderConfirmationEmail(data: any) {
    return firstValueFrom(this.grpcEmailService.sendOrderConfirmationEmail(data));
  }

  async sendPasswordResetEmail(data: any) {
    return firstValueFrom(this.grpcEmailService.sendPasswordResetEmail(data));
  }
}
