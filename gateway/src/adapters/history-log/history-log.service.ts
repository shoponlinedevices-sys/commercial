import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export type HistoryLog = {
  id: string | number;
  action: string;
  entityType: string;
  entityId: string;
  source: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

@Injectable()
export class HistoryLogService implements OnModuleInit {
  private sales: any;
  private products: any;
  private contacts: any;

  constructor(
    @Inject('GRPC_ORDERS_SERVICE') private readonly salesClient: ClientGrpc,
    @Inject('GRPC_PRODUCTS_SERVICE') private readonly productsClient: ClientGrpc,
    @Inject('GRPC_CONTACTS_SERVICE') private readonly contactsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.sales = this.salesClient.getService<any>('OrdersService');
    this.products = this.productsClient.getService<any>('ProductService');
    this.contacts = this.contactsClient.getService<any>('ContactsService');
  }

  async findAll(limit = 200): Promise<HistoryLog[]> {
    const responses = await Promise.all([
      this.sales?.getHistoryLogs({ limit }),
      this.products?.getHistoryLogs({ limit }),
      this.contacts?.getHistoryLogs({ limit }),
    ].map(async (call) => {
      try {
        if (!call) return [];
        const response = await firstValueFrom(call) as any;
        return (response?.logs || []).map((log: any) => ({
          ...log,
          metadata: log.metadata ? JSON.parse(log.metadata) : undefined,
        })) as HistoryLog[];
      } catch (error) {
        console.error('[HistoryLogService] Failed to read history via gRPC:', error);
        return [];
      }
    }));

    return responses.flat()
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
      .slice(0, limit);
  }
}
