import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IGrpcOrdersService } from '../../../../packages/contracts/grpc/interface/grpc-orders.service';

@Injectable()
export class OrderGrpcClient implements OnModuleInit {
  private orderService!: IGrpcOrdersService;

  constructor(@Inject('GRPC_ORDERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<IGrpcOrdersService>('OrdersService');
  }
}
