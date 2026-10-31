import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcInventoryService } from '../../../../packages/contracts/grpc/interface/grpc-inventory.service';
import { IProductSaleStock } from '../../../../packages/contracts/model/product/product.model';

@Injectable()
export class InventoryGrpcClient implements OnModuleInit {
  private inventoryService!: IGrpcInventoryService;

  constructor(@Inject('GRPC_INVENTORY_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.inventoryService = this.client.getService<IGrpcInventoryService>('InventoryService');
  }

  saleStock(data: IProductSaleStock) { return firstValueFrom(this.inventoryService.saleStock(data)); }
  returnInventory(data: IProductSaleStock) { return firstValueFrom(this.inventoryService.returnInventory(data)); }
}
