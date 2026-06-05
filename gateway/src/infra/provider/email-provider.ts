import {
  Injectable,
  Inject,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmailProvider {
  constructor(
    @Inject('GRPC_EMAILS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async sendEmail(
    data: any,
  ) {
    return await firstValueFrom(
      this.client.send(
        { cmd: 'sendEmail' },
        data,
      ),
    );
  }
}