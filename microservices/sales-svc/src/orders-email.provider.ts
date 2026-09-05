import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcEmailService } from '../../../packages/contracts/grpc/interface/grpc-emails.service';

@Injectable()
export class OrdersEmailProvider implements OnModuleInit {
  private emailService!: IGrpcEmailService;

  constructor(@Inject('GRPC_EMAILS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.emailService = this.client.getService<IGrpcEmailService>('EmailService');
  }

  sendOrderConfirmationEmail(data: Parameters<IGrpcEmailService['sendOrderConfirmationEmail']>[0]) {
    return firstValueFrom(this.emailService.sendOrderConfirmationEmail(data));
  }
}