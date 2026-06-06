import {
  Injectable,
  Inject,
  OnModuleInit,
} from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';
import { IGrpcEmailService } from '../grpc-emailss.service';

@Injectable()
export class EmailProvider implements OnModuleInit {
  private grpcEmailService!: IGrpcEmailService;

  constructor(
    @Inject('GRPC_EMAILS_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcEmailService = this.client.getService<IGrpcEmailService>('EmailService');
  }

  async sendEmail(
    data: any,
  ) {
    return await firstValueFrom(
      this.grpcEmailService.sendEmail(data),
    );
  }
}